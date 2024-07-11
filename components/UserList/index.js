import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
  cursor: pointer;

  .sort-icon {
    vertical-align: middle;
    margin-left: 5px;
  }
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const columnFields = [
  { value: 'id', label: 'Id' },
  { value: 'name', label: 'Name', enableSearch: true },
  { value: 'email', label: 'Email', enableSearch: true },
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortColumn, setSortColumn] = useState(columnFields[0].value);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: usersData } = await axios.get('/api/v1/users');
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const handleOnSearch = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setSearchName(value);
    } else if (name === 'email') {
      setSearchEmail(value);
    } else {
      throw new Error('Unknown search element');
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    let filtered = users.filter((user) => {
      const nameMatch = user.name && user.name.toLowerCase().includes(searchName.toLowerCase());
      const emailMatch = user.email && user.email.toLowerCase().includes(searchEmail.toLowerCase());
      return nameMatch && emailMatch;
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        const x = typeof a[sortColumn] === 'string' ? a[sortColumn] : '';
        const y = typeof b[sortColumn] === 'string' ? b[sortColumn] : '';
        return sortDirection === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchName, searchEmail, sortColumn, sortDirection]);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            {columnFields.map((field) => (
              <Th key={field.value}>
                <div onClick={() => handleSort(field.value)} style={{ paddingBottom: 8 }}>
                  {field.label}
                  {sortColumn === field.value && (
                    sortDirection === 'asc' ? (
                      <span className="sort-icon">▲</span>
                    ) : (
                      <span className="sort-icon">▼</span>
                    )
                  )}
                </div>
                {field.enableSearch && (
                  <input
                    type="text"
                    placeholder={`Search by ${field.label}`}
                    name={field.value}
                    onChange={handleOnSearch}
                    style={{ padding: 6, width: 200 }}
                  />
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              {columnFields.map((field) => (
                <Td key={field.value}>{user[field.value]}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;

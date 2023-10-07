import React, { useState, useEffect } from 'react';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const calculatePasswordStrength = (value) => {
  const strength = value.length >= 8 ? 'Strong' : value.length >= 6 ? 'Medium' : 'Weak';
  return strength;
};

const getCurrentDateTime = () => {
  const now = new Date();
  const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  return formattedDate;
};

const loginUser = (username, password, onLogin, setLoginError) => {
  const storedCredentials = JSON.parse(localStorage.getItem(`userCredentials_${username}`));
  if (storedCredentials && storedCredentials.password === password) {
    localStorage.setItem('userToken', 'authenticated');
    onLogin(username);
  } else {
    setLoginError('Invalid username or password');
  }
};

const UserProfilePage = ({ username, onProfileUpdated }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem(`userProfile_${username}`));
    if (userProfile) {
      setFullName(userProfile.fullName);
      setEmail(userProfile.email);
      setDateOfBirth(userProfile.dateOfBirth);
    }
  }, [username]);

  const handleUpdateProfile = () => {
    localStorage.setItem(
      `userProfile_${username}`,
      JSON.stringify({
        fullName,
        email,
        dateOfBirth,
      })
    );
    onProfileUpdated();
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
      <h1>Edit Profile</h1>
      <div>
        <label>Full Name:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
      </div>
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

const LoginPage = ({ onLogin, onCreateAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    loginUser(username, password, onLogin, setLoginError);
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
      <h1>Login</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <button onClick={onCreateAccount}>Create Account</button>
      </p>
    </div>
  );
};

const CreateAccountPage = ({ onAccountCreated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [createAccountError, setCreateAccountError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleCreateAccount = () => {
    if (password === confirmPassword) {
      localStorage.setItem(`userProfile_${username}`, JSON.stringify({ fullName, email, dateOfBirth }));
      localStorage.setItem(`userCredentials_${username}`, JSON.stringify({ password }));
      localStorage.setItem(`userColor_${username}`, getRandomColor());
      onAccountCreated();
    } else {
      setCreateAccountError('Passwords do not match');
    }
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
      <h1>Create Account</h1>
      <div>
        <label>Full Name:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordStrength(calculatePasswordStrength(e.target.value));
          }}
        />
        {passwordStrength && <p>Password Strength: {passwordStrength}</p>}
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {createAccountError && <p style={{ color: 'red' }}>{createAccountError}</p>}
      <button onClick={handleCreateAccount}>Create Account</button>
    </div>
  );
};

const PersonalExpenseTracker = ({ username, onExpenseAdded, onExpenseDeleted, onToggleAccount }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', total: '', date: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [totalErrorMessage, setTotalErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const userExpenses = JSON.parse(localStorage.getItem(`userExpenses_${username}`));
    if (userExpenses) {
      setExpenses(userExpenses);
    }
  }, [username]);

  const addExpense = () => {
    if (newExpense.name.trim() !== '' && /^\d+$/.test(newExpense.total)) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

      const userColor = localStorage.getItem(`userColor_${username}`);
      const updatedExpenses = [...expenses, { ...newExpense, date: formattedDate, userColor }];
      setExpenses(updatedExpenses);
      localStorage.setItem(`userExpenses_${username}`, JSON.stringify(updatedExpenses));

      setNewExpense({ name: '', total: '', date: '' });
      setTotalErrorMessage('');

      // Notify the parent component (ExpenseTracker) about the added expense
      onExpenseAdded({ ...newExpense, date: formattedDate, userColor });
    } else {
      setTotalErrorMessage('Please enter a valid number for total $');
    }
  };

  const deleteExpense = (index) => {
    const deletedExpense = expenses[index];
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
    localStorage.setItem(`userExpenses_${username}`, JSON.stringify(updatedExpenses));
    setIsDeleting(false);

    // Notify the parent component (ExpenseTracker) about the deleted expense
    onExpenseDeleted(deletedExpense);
  };

  const confirmDelete = (index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this expense?');
    if (isConfirmed) {
      setIsDeleting(true);
      setTimeout(() => {
        deleteExpense(index);
      }, 500);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const updateExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = {
      name: updatedExpenses[index].name,
      total: /^\d+$/.test(updatedExpenses[index].total) ? updatedExpenses[index].total : '',
      date: updatedExpenses[index].date,
      userColor: updatedExpenses[index].userColor,
    };
    setExpenses(updatedExpenses);
    localStorage.setItem(`userExpenses_${username}`, JSON.stringify(updatedExpenses));
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setNewExpense({ name: '', total: '', date: '' });
    setTotalErrorMessage('');
  };

  const calculateTotal = () => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.total), 0).toFixed(2);
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: 'auto' }}>
      <h1>Personal Expenses Tracker</h1>
      <div>
        <input
          type="text"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          placeholder="Enter a name"
        />
        <input
          type="text"
          value={newExpense.total}
          onChange={(e) => {
            const totalValue = e.target.value;
            setNewExpense({
              ...newExpense,
              total: totalValue,
              date: new Date().toLocaleDateString(),
            });
            setTotalErrorMessage(/^\d+$/.test(totalValue) ? '' : 'Please enter a valid number for total $');
          }}
          placeholder="Enter total $"
        />
        {totalErrorMessage && <p style={{ color: 'red' }}>{totalErrorMessage}</p>}
        <button onClick={addExpense}>Add Expense</button>
        <button onClick={onToggleAccount}>Toggle Account</button>
      </div>
      <div>
        <p>Total Personal Expenses: ${calculateTotal()}</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Total $</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd', color: expense.userColor }}>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => {
                      const updatedExpenses = [...expenses];
                      updatedExpenses[index].name = e.target.value;
                      setExpenses(updatedExpenses);
                    }}
                  />
                ) : (
                  expense.name
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={expense.total}
                    onChange={(e) => {
                      const updatedExpenses = [...expenses];
                      updatedExpenses[index].total = /^\d+$/.test(e.target.value) ? e.target.value : '';
                      setExpenses(updatedExpenses);
                    }}
                  />
                ) : (
                  `$${expense.total}`
                )}
              </td>
              <td style={{ padding: '8px' }}>{expense.date}</td>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <>
                    <button onClick={() => updateExpense(index)}>Update</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(index)}>Edit</button>
                    <button onClick={() => confirmDelete(index)} disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SharedExpenseTracker = ({ username, sharedExpenses, onSharedExpenseDeleted, onSharedExpenseUpdated, userColor }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = (index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this expense?');
    if (isConfirmed) {
      setIsDeleting(true);
      setTimeout(() => {
        onSharedExpenseDeleted(index);
        setIsDeleting(false);
      }, 500);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const updateSharedExpense = (index, updatedExpense) => {
    onSharedExpenseUpdated(index, updatedExpense);
    setEditingIndex(null);
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: 'auto' }}>
      <h1>Shared Expenses Tracker</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Total $</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Payer</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sharedExpenses.map((expense, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => {
                      const updatedExpense = { ...expense, name: e.target.value };
                      updateSharedExpense(index, updatedExpense);
                    }}
                  />
                ) : (
                  expense.name
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={expense.total}
                    onChange={(e) => {
                      const updatedExpense = {
                        ...expense,
                        total: /^\d+$/.test(e.target.value) ? e.target.value : '',
                      };
                      updateSharedExpense(index, updatedExpense);
                    }}
                  />
                ) : (
                  `$${expense.total}`
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={expense.payer}
                    onChange={(e) => {
                      const updatedExpense = { ...expense, payer: e.target.value };
                      updateSharedExpense(index, updatedExpense);
                    }}
                  />
                ) : (
                  expense.payer
                )}
              </td>
              <td style={{ padding: '8px' }}>{expense.date}</td>
              <td style={{ padding: '8px' }}>
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => {
                        const updatedExpense = { ...expense, date: getCurrentDateTime() };
                        updateSharedExpense(index, updatedExpense);
                      }}
                    >
                      Update
                    </button>
                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEditing(index)}>Edit</button>
                )}
                <button onClick={() => confirmDelete(index)} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExpenseTracker = ({ username }) => {
  const [currentPage, setCurrentPage] = useState('personal');
  const [sharedExpenses, setSharedExpenses] = useState([]);

  const [showPersonalExpenses, setShowPersonalExpenses] = useState(true);
  const [showSharedExpenses, setShowSharedExpenses] = useState(true);

  useEffect(() => {
    const userSharedExpenses = JSON.parse(localStorage.getItem(`userSharedExpenses_${username}`));
    if (userSharedExpenses) {
      setSharedExpenses(userSharedExpenses);
    }
  }, [username]);

  const handleExpenseAdded = (expense) => {
    const updatedSharedExpenses = [...sharedExpenses, { ...expense, participant: [username] }];
    setSharedExpenses(updatedSharedExpenses);
    localStorage.setItem(`userSharedExpenses_${username}`, JSON.stringify(updatedSharedExpenses));
  };

  const handleExpenseDeleted = (deletedExpense) => {
    const updatedSharedExpenses = sharedExpenses.map((expense) => {
      if (expense.name === deletedExpense.name && expense.total === deletedExpense.total) {
        const updatedExpense = { ...expense, participant: expense.participant.filter((p) => p !== username) };
        return updatedExpense;
      }
      return expense;
    });

    setSharedExpenses(updatedSharedExpenses);
    localStorage.setItem(`userSharedExpenses_${username}`, JSON.stringify(updatedSharedExpenses));
  };

  const handleExpenseUpdated = (index, updatedExpense) => {
    const updatedSharedExpenses = [...sharedExpenses];
    updatedSharedExpenses[index] = updatedExpense;
    setSharedExpenses(updatedSharedExpenses);
    localStorage.setItem(`userSharedExpenses_${username}`, JSON.stringify(updatedSharedExpenses));
  };

  const handleSharedExpenseDeleted = (index) => {
    const updatedSharedExpenses = [...sharedExpenses];
    updatedSharedExpenses.splice(index, 1);
    setSharedExpenses(updatedSharedExpenses);
    localStorage.setItem(`userSharedExpenses_${username}`, JSON.stringify(updatedSharedExpenses));
  };

  const handleToggleAccount = () => {
    setShowPersonalExpenses(!showPersonalExpenses);
    setShowSharedExpenses(!showSharedExpenses);
  };

  const switchToPersonal = () => setCurrentPage('personal');
  const switchToShared = () => setCurrentPage('shared');

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Expense Tracker</h1>
      <div>
        <button onClick={switchToPersonal}>Personal Expenses</button>
        <button onClick={switchToShared}>Shared Expenses</button>
        <button onClick={handleToggleAccount}>Toggle Account</button>
      </div>
      {currentPage === 'personal' && showPersonalExpenses ? (
        <PersonalExpenseTracker
          username={username}
          onExpenseAdded={handleExpenseAdded}
          onExpenseDeleted={handleExpenseDeleted}
          onToggleAccount={handleToggleAccount}
        />
      ) : (
        <SharedExpenseTracker
          username={username}
          sharedExpenses={sharedExpenses}
          onSharedExpenseDeleted={handleSharedExpenseDeleted}
          onSharedExpenseUpdated={handleExpenseUpdated}
          userColor={localStorage.getItem(`userColor_${username}`)}
        />
      )}
    </div>
  );
};

const App = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(localStorage.getItem('userToken'));
  const [createAccountPage, setCreateAccountPage] = useState(false);

  const handleLogin = (username) => {
    setAuthenticatedUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setAuthenticatedUser(null);
  };

  const handleCreateAccount = () => {
    setCreateAccountPage(true);
  };

  const handleAccountCreated = () => {
    setCreateAccountPage(false);
  };

  return (
    <div>
      {authenticatedUser ? (
        <>
          <h1 style={{ textAlign: 'center' }}>Welcome, {authenticatedUser}!</h1>
          <button onClick={handleLogout}>Logout</button>
          <ExpenseTracker username={authenticatedUser} />
        </>
      ) : createAccountPage ? (
        <CreateAccountPage onAccountCreated={handleAccountCreated} />
      ) : (
        <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} />
      )}
    </div>
  );
};

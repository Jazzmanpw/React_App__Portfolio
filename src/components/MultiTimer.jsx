import React, { useEffect, useRef, useState } from 'react';

export default function MultiTimer() {
  const { addUser, removeUser, users, timers, setTimer } = useUserList();
  const [user, setUser] = useState(users[0]);
  return (
    <div>
      <UserList
        users={users}
        timers={timers}
        addUser={(name) => {
          addUser(name);
          if (!users.length) {
            setUser(name);
          }
        }}
        removeUser={(name) => {
          removeUser(name);
          if (name === user) {
            setUser(users.find((u) => u !== name));
          }
        }}
        setUser={setUser}
      />
      <Timer
        user={user}
        timer={timers[user]}
        setTimer={(timer) => setTimer(user, timer)}
      />
    </div>
  );
}

function UserList({ users, addUser, removeUser, setUser }) {
  const formRef = useRef();
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const name = new FormData(formRef.current).get('name');
          if (users.includes(name)) {
            alert('cannot use duplicated names!');
          } else {
            addUser(name);
          }
        }}
        ref={formRef}
      >
        <input type="text" name="name" autoComplete="off" />
        <button>Add a user</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <span style={{ cursor: 'pointer' }} onClick={() => setUser(user)}>
              {user}
            </span>{' '}
            <span
              style={{ cursor: 'pointer', fontStyle: 'italic' }}
              onClick={() => removeUser(user)}
            >
              (remove)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useUserList() {
  const [{ users, timers }, setList] = useState(
    JSON.parse(localStorage.getItem('pomodoro-list')) || {
      users: [],
      timers: {},
    },
  );
  useEffect(() => {
    const prevList = JSON.parse(localStorage.getItem('pomodoro-list'));
    if (
      !prevList ||
      prevList.users.length !== users.length ||
      Object.keys(prevList.timers).length !== Object.keys(timers).length ||
      Object.keys(prevList.timers).some(
        (key) => prevList.timers[key].isStopped !== timers[key].isStopped,
      )
    ) {
      localStorage.setItem('pomodoro-list', JSON.stringify({ users, timers }));
    }
  }, [users, timers]);
  return {
    users,
    timers,
    addUser: (name) => {
      setList((state) => ({ ...state, users: [...state.users, name] }));
    },
    removeUser: (name) => {
      setList((state) => ({
        users: state.users.filter((user) => user !== name),
        timers: omit(state.timers, name),
      }));
    },
    setTimer: (name, timer) => {
      setList((state) => ({
        ...state,
        timers: timer
          ? { ...state.timers, [name]: timer }
          : omit(state.timers, name),
      }));
    },
  };
}

function Timer({ user, timer, setTimer }) {
  const [now, setNow] = useState(Date.now());
  const timerOn = !!timer && !timer.isStopped;

  useEffect(() => {
    if (timerOn) {
      const intervalId = setInterval(() => {
        setNow(Date.now());
      });
      return () => clearInterval(intervalId);
    }
  }, [timerOn]);

  if (!user) return null;

  const interval = timer ? now - timer.start : null;

  return (
    <main>
      <h2>{user}</h2>
      {interval ? (
        <div>
          Time: {formatTime(interval)}
          <br />
          {timer.isStopped ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setTimer({ start: Date.now() - interval });
                }}
              >
                Continue
              </button>
              <button type="button" onClick={() => setTimer(undefined)}>
                Clear
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setTimer({ ...timer, isStopped: true })}
            >
              Stop
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => setTimer({ start: Date.now() })}>
          Start
        </button>
      )}
    </main>
  );
}

function omit(object, key) {
  const { [key]: _, ...rest } = object;
  return rest;
}

function formatTime(interval) {
  const minutes = `${getMinutes(interval)}`.padStart(2, '0');
  const seconds = `${getSeconds(interval)}`.padStart(2, '0');
  const milliseconds = `${getMilliseconds(interval)}`.padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}

function getMilliseconds(interval) {
  return interval % 1000;
}

function getSeconds(interval) {
  return Math.round((interval / 1000) % 60);
}

function getMinutes(interval) {
  return Math.round((interval / 1000 / 60) % 60);
}

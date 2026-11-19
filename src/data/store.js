// Frontend-only demo storage (localStorage). Replace with real API calls later.
const USERS_KEY = "portal_users";
const SESSION_KEY = "portal_session";
const MODULE_KEY = "portal_module";
const FEEDBACK_KEY = "portal_feedback";

const emptyDocs = { photo: null, signature: null, aadhaar: null, idcard: null };

const seed = [
  { id: "u1", name: "Aarav Patil", email: "aarav@gmail.com", phone: "9876543210", qualification: "B.Sc Computer Science", docs: { ...emptyDocs }, status: "pending" },
  { id: "u2", name: "Sneha Kulkarni", email: "sneha@gmail.com", phone: "9123456780", qualification: "12th Science", docs: { ...emptyDocs }, status: "verified" },
  { id: "u3", name: "Rohan Deshmukh", email: "rohan@gmail.com", phone: "9988776655", qualification: "B.Com", docs: { ...emptyDocs }, status: "rejected" },
  { id: "u4", name: "Pooja Shinde", email: "pooja@gmail.com", phone: "9090909090", qualification: "Diploma Engineering", docs: { ...emptyDocs }, status: "pending" },
];

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // storage full
  }
};

export const getUsers = () => {
  const users = read(USERS_KEY, null);
  if (users) return users;
  write(USERS_KEY, seed);
  return seed;
};
export const saveUsers = (users) => write(USERS_KEY, users);

export const findOrCreateUser = (email, name) => {
  const users = getUsers();
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: "u" + Date.now(),
      name: name || email.split("@")[0],
      email,
      phone: "",
      qualification: "",
      docs: { ...emptyDocs },
      status: "incomplete",
    };
    saveUsers([...users, user]);
  }
  return user;
};

export const updateUser = (updated) => {
  const users = getUsers().map((u) => (u.id === updated.id ? updated : u));
  return saveUsers(users) ? updated : null;
};

export const getSession = () => read(SESSION_KEY, null);
export const setSession = (s) => (s ? write(SESSION_KEY, s) : localStorage.removeItem(SESSION_KEY));

export const getModule = () => read(MODULE_KEY, null);
export const setModule = (m) => write(MODULE_KEY, m);

export const addFeedback = (f) => write(FEEDBACK_KEY, [...read(FEEDBACK_KEY, []), { ...f, at: new Date().toISOString() }]);

// Status helper: a user is "ready for verification" once profile + all docs are filled.
export const isProfileComplete = (u) =>
  !!(u.name && u.email && u.phone && u.qualification && u.docs.photo && u.docs.signature && u.docs.aadhaar && u.docs.idcard);

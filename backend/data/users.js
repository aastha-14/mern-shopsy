import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'adminUser',
        email: 'admin@user.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: 'true'
    },
    {
        name: 'John Doe',
        email: 'john@user.com',
        password: bcrypt.hashSync('12345', 10),
    },
    {
        name: 'Jane Doe',
        email: 'jane@user.com',
        password: bcrypt.hashSync('12345', 10),
    }
];
export default users;
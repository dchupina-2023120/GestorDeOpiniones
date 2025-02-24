import { hash, verify } from 'argon2'
import { generateJwt } from '../../utils/jwt.js'
import User from '../user/user.model.js'

export const register = async (req, res) => {
    try {
        let data = req.body;
        const existingUser = await User.findOne(
            {
                $or: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        )
        if (existingUser) {
            return res.status(400).send(
                {
                    message: 'Email or Username is already taken'
                }
            )
        }
        data.password = await hash(data.password);
        data.role = 'CLIENT';
        let user = new User(data);
        await user.save();
        return res.status(201).send(
            {
                message: `Registered successfully, you can log in with username: ${user.username}`,
                user
            }
        )
    } catch (err) {
        console.error(err);
        return res.status(500).send(
            {
                message: 'General error with user registration',
                err
            }
        )
    }
};


export const login = async (req, res) => {
    try {
        let { userLoggin, password } = req.body;

        let user = await User.findOne({
            $or: [{ email: userLoggin }, 
                    { username: userLoggin }]
        });

        if (!user) {
            return res.status(400).send(
                { 
                    message: 'Invalid credentials' 
                }
            )
        }

        const passwordMatch = await verify(user.password, password);
        if (!passwordMatch) {
            return res.status(400).send(
                { 
                    message: 'Invalid credentials' 
                }
            )
        }

        // Generar el token
        let loggedUser = {
            uid: user._id,
            username: user.username,
            name: user.name,
            role: user.role
        }

        let token = await generateJwt(loggedUser);

        return res.send({
            message: `Welcome ${user.name}`,
            loggedUser,
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send(
            { 
                message: 'General error with login function', 
                err 
            }
        )
    }
}


export const test = (req, res) => {
    console.log('Test is running')
    res.send(
        {
            message: 'Test is running'
        }
    )
}


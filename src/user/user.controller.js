import { hash, verify } from "argon2";
import { encrypt } from "../../utils/encrypt.js"
import User from "../user/user.model.js"

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        if (!updatedUser) return res.status(404).send(
            { 
                success: false,
                message: 'User not found' 
            }
        )

        return res.send(
            {
                success: true,
                message: 'User updated',
                user: updatedUser
            }
        )
    } catch (error) {
        console.error('General error', error);
        return res.status(500).send(
            { 
                success: false, 
                message: 'General error', 
                error 
            }
        )
    }
}

export const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).send(
            { 
                success: false, 
                message: 'User not found' 
            }
        )

        const isMatch = await verify(user.password, currentPassword);
        if (!isMatch) return res.status(400).send(
            { 
                success: false, 
                message: 'Incorrect current password' 
            }
        )

        const hashedPassword = await hash(newPassword);
        user.password = hashedPassword;
        await user.save();

        return res.send(
            { 
                success: true, 
                message: 'Password updated successfully' 
            }
        )
    } catch (error) {
        console.error('General error', error);
        return res.status(500).send(
            { 
                success: false, 
                message: 'General error', 
                error 
            }
        )
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "User not found" 
                }
            )
        }

        user.status = "INACTIVE"; 
        await user.save();

        return res.status(200).send(
            { 
                success: true, 
                message: "User deactivated successfully" 
            }
        )
    } catch (err) {
        console.error(err);
        return res.status(500).send(
            { 
                success: false, 
                message: "Error deactivating user", 
                err 
            }
        )
    }
}

const agregarUsuarioPorDefecto = async () => {
    try {
        const defaultAdmin = await User.findOne({ role: 'ADMIN' })
    if (!defaultAdmin) {
             const usuarioAdmin = new User({
                name: 'Diego Andre ',
                surname: 'Chupina Mendez',
                username: 'dchupina ',
                email: `${process.env.ADMIN_EMAIL}`,
                password: await encrypt(`${process.env.ADMIN_PASSWORD}`, 12),
                role: "ADMIN",
                status: "ACTIVE"
            })
 
            await usuarioAdmin.save();
            console.log("Usuario administrador por defecto agregado");
        }
    }catch (err) {
            console.error("Error al agregar usuario por defecto:", 
            err
        )
    }
}

agregarUsuarioPorDefecto()

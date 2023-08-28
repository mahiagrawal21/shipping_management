// adminController.ts
import { Request, Response } from 'express';
import { AdminModel } from '../models/adminModel';
import bcrypt from 'bcrypt';

const saltRounds = 10;

async function createAdmin(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = new AdminModel({
      username,
      email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(500).json({ error: 'Could not create admin' });
  }
}

async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (isPasswordCorrect) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not log in' });
  }
}

export { createAdmin, loginAdmin };

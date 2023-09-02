import { Request, Response } from 'express';
import {DepartmentModel} from '../models/departmentModel';
import {
  encryptPassword,
  decryptPassword,
} from '../utilities/password_encrypt_decrypt_helper';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

interface DepartmentDocument extends Document {
  _id: string;
  name: string;
  location: string;
  registrationNumber: string;
  contactEmail: string;
  contactNumber: string;
  password: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

interface AuthenticatedDepartmentRequest extends Request {
  department: DepartmentDocument;
}

//post - registration of courier agency
export const  addDepartment= async (req: Request, res: Response) => {
  try {
    const departmentExist = await DepartmentModel.findOne({
      registrationNumber: req.body.registrationNumber,
    });
    if (departmentExist) {
      return res.status(400).json({
        status: 'failure',
        message: 'Department with given registration number already exists',
        data: {},
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid Password Input',
        data: {},
      });
    }
    const securePassword = await encryptPassword(req.body.password);
    if (securePassword === null) {
      return res.status(500).json({
        status: 'failure',
        message: 'Password Encryption failed',
        data: {},
      });
    }
    const department = new DepartmentModel({
      name: req.body.name,
      location: req.body.location,
      registrationNumber: req.body.registrationNumber,
      contactEmail: req.body.contactEmail,
      contactNumber: req.body.contactNumber,
      password: securePassword,
      city: req.body.city,
      state: req.body.state,
      pinCode: req.body.pinCode,
      country: req.body.country,
    });

    const newDepartment = await department.save();

    const loggedInDepartment = { _id: department._id };
    const accessToken = jwt.sign(
      loggedInDepartment,
      process.env.SECRET_KEY2 || ''
    );

    return res.status(201).json({
      status: 'success',
      message: 'Department added successfully',
      data: { accessToken },
    }); // 201 => creation success
  } catch (error) {
    return res.status(400).json({ message: error.message }); // 400 => invalid user inputs
  }
}

//post-LOGIN OF COURIER AGENCY
export const loginDepartment = async (req: Request, res: Response) => {
  const regNo = req.body.registrationNumber;
  const userInputPassword = req.body.password;

  try {
    const department = await DepartmentModel.findOne({
      registrationNumber: regNo,
    });

    if (!department) {
      return res.status(404).json({
        status: 'failure',
        message: 'No department found with given credentials',
        data: {},
      });
    }

    const loggedInDepartment = { _id: department._id };
    const accessToken = jwt.sign(
      loggedInDepartment,
      process.env.SECRET_KEY2 || ''
    );

    const decryptedPasswordDB = await decryptPassword(
      userInputPassword,
      department.password
    );

    if (decryptedPasswordDB) {
      return res.status(200).json({
        status: 'success',
        message: 'Login Success',
        data: { accessToken },
      });
    } else {
      return res.status(401).json({
        status: 'failure',
        message: 'Incorrect Password',
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message }); // 400 => invalid user inputs
  }
}

//get-profile of courier agency
export const getDepartmentProfile = async (req: AuthenticatedDepartmentRequest, res: Response) => {
  try {
     const departmentId = req.department._id;
    // console.log(departmentId);
    const department = await DepartmentModel.findById(departmentId).select(
      '-password'
    );
    if (department) {
      return res.status(200).json({
        status: 'success',
        message: 'Department found successfully',
        data: department,
      });
    }

    return res.status(404).json({
      status: 'failure',
      message: 'Department not found',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


//patch- update profile of courier agency
export const updateDepartmentProfile = async (req: AuthenticatedDepartmentRequest, res: Response)=> {
  try {
    const departmentId = req.department._id;
    const currentDepartment = await DepartmentModel.findByIdAndUpdate(
      departmentId,
      req.body
    );

    const updatedDepartment = await DepartmentModel.findById(
      currentDepartment._id
    ).select('-password');

    if (updatedDepartment) {
      return res.status(200).json({
        status: 'success',
        message: 'Updated successfully',
        data: updatedDepartment,
      });
    }

    return res.status(404).json({
      status: 'failure',
      message: 'Department not found',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  addDepartment,
  loginDepartment,
  getDepartmentProfile,
  updateDepartmentProfile,
};

import express from 'express';
import Parent from '../model/parents.js';
import dotenv from 'dotenv';
import Child from '../model/childrens.js';
import authMiddleware from '../middleware/auth.js';
import Appointment from '../model/appointment.js';
import Vaccine from '../model/vaccines.js';
import VaccineSlot from '../model/slotVaccine.js';

dotenv.config();

const parentRouter = express.Router();

parentRouter.put('/update', authMiddleware, async (req, res) => {
    try {
        const { userId, name, phone, address, gender } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (gender !== undefined) updateData.gender = gender;

        const updatedParent = await Parent.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedParent) {
            return res.status(404).json({ message: 'Parent profile not found' });
        }

        res.status(200).json({
            message: 'Parent profile updated successfully',
            parent: updatedParent,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

parentRouter.post('/child/create', authMiddleware, async (req, res) => {
    try {
        const { parentId, name, dateOfBirth, gender, bloodType, medicalHistory } =
            req.body;

        if (!parentId || !name || !dateOfBirth || !gender) {
            return res
                .status(400)
                .json({
                    message: 'parentId, name, dateOfBirth, and gender are required',
                });
        }

        const parentExists = await Parent.findById(parentId);
        if (!parentExists) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const child = new Child({
            parentId,
            name,
            dateOfBirth,
            gender,
            bloodType,
            medicalHistory,
        });

        await child.save();

        res.status(201).json({
            message: 'Child created successfully',
            child,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

parentRouter.put('/child/update', authMiddleware, async (req, res) => {
    try {
        const { childId, parentId } = req.body;

        if (!childId || !parentId) {
            return res.status(400).json({
                message: 'childId and parentId are required',
            });
        }

        const parentExists = await Parent.findById(parentId);
        if (!parentExists) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        if (child.parentId.toString() !== parentId) {
            return res
                .status(403)
                .json({ message: 'You are not authorized to update this child' });
        }

        if (req.body.name !== undefined) child.name = req.body.name;
        if (req.body.dateOfBirth !== undefined)
            child.dateOfBirth = req.body.dateOfBirth;
        if (req.body.gender !== undefined) child.gender = req.body.gender;
        if (req.body.bloodType !== undefined) child.bloodType = req.body.bloodType;
        if (req.body.medicalHistory !== undefined)
            child.medicalHistory = req.body.medicalHistory;

        await child.save();

        res.status(200).json({
            message: 'Child updated successfully',
            child,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
parentRouter.post('/appointment/create', authMiddleware, async (req, res) => {
    try {
        const {
            vaccineSlotId,
            childId,
            parentId,
            vaccineId,
            appointmentDate
        } = req.body;

        if (!vaccineSlotId || !childId || !parentId || !vaccineId || !appointmentDate) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const parentExists = await Parent.findById(parentId);
        if (!parentExists) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const childExists = await Child.findById(childId).populate('parentId');
        if (!childExists || childExists.parentId._id.toString() !== parentId) {
            return res.status(403).json({ message: 'Child not found or does not belong to parent' });
        }

        const vaccineSlotExists = await VaccineSlot.findById(vaccineSlotId);
        if (!vaccineSlotExists) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        const vaccineDetails = await Vaccine.findById(vaccineId);
        if (!vaccineDetails) {
            return res.status(404).json({ message: 'Vaccine not found' });
        }

        if (vaccineDetails.quantity < vaccineDetails.dosesRequired) {
            return res.status(400).json({ message: 'Not enough vaccine doses available' });
        }

        const appointments = [];
        let nextAppointmentDate = new Date(appointmentDate);

        for (let dose = 1; dose <= vaccineDetails.dosesRequired; dose++) {
            const newAppointment = new Appointment({
                vaccineSlotId,
                childId,
                parentId,
                vaccineId,
                appointmentDate: new Date(nextAppointmentDate),
                doseNumber: dose,
                status: 'Chờ xác nhận',
                paymentStatus: 'Chưa thanh toán',
            });

            await newAppointment.save();
            appointments.push(newAppointment);

            if (vaccineDetails.intervalMonths) {
                nextAppointmentDate.setMonth(nextAppointmentDate.getMonth() + vaccineDetails.intervalMonths);
            } else if (vaccineDetails.intervalDays) {
                nextAppointmentDate.setDate(nextAppointmentDate.getDate() + vaccineDetails.intervalDays);
            } else {
                nextAppointmentDate.setMonth(nextAppointmentDate.getMonth() + 1);
            }
        }

        vaccineDetails.quantity -= vaccineDetails.dosesRequired;
        await vaccineDetails.save();

        res.status(201).json({
            message: 'Recurring appointments created successfully',
            appointments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointments', error: error.message });
    }
});

export default parentRouter;

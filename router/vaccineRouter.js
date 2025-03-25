import express from 'express';
import Vaccine from '../model/vaccines.js';
import { v4 as uuidv4 } from 'uuid';
import VaccineSlot from '../model/slotVaccine.js';

const vaccineRouter = express.Router();

vaccineRouter.post('/create', async (req, res) => {
    try {
        const {
            name,
            description,
            ageGroup,
            dosesRequired,
            price,
            quantity
        } = req.body; 

        const vaccineId = `VAC-${uuidv4().split('-')[0].toUpperCase()}`;

        const newVaccine = new Vaccine({
            vaccineId,
            name,
            description,
            ageGroup,
            dosesRequired,
            price,
            quantity 
        });

        await newVaccine.save();

        res.status(201).json({ message: 'Vaccine created successfully', vaccine: newVaccine });
    } catch (err) {
        console.error('Error creating vaccine:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
vaccineRouter.post('/create-slot', async (req, res) => {
    try {
        const { date, startTime, endTime, capacity } = req.body;

        if (!date || !startTime || !endTime || !capacity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newSlot = new VaccineSlot({
            date,
            startTime,
            endTime,
            capacity,
            available_capacity: capacity
        });

        await newSlot.save();

        res.status(201).json({ message: 'Vaccine slot created successfully', slot: newSlot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default vaccineRouter;



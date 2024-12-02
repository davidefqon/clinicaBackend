import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear una cita
export const crearCita = async (req: Request, res: Response): Promise<void> => {
  const { date, status, doctorId, patientId, serviceId } = req.body;

  try {
    const nuevaCita = await prisma.appointment.create({
      data: {
        date: new Date(date), // Asegurando el formato correcto de la fecha
        status,
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id: patientId } },
        service: { connect: { id: serviceId } },
      },
    });

    res.status(201).json(nuevaCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la cita' });
  }
};

// Obtener todas las citas
export const obtenerCitas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const citas = await prisma.appointment.findMany({
      include: {
        doctor: true,
        patient: true,
        service: true,
      },
    });
    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las citas' });
  }
};

// Actualizar una cita
export const actualizarCita = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { date, status, doctorId, patientId, serviceId } = req.body;

  try {
    const citaActualizada = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        status,
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id: patientId } },
        service: { connect: { id: serviceId } },
      },
    });

    res.status(200).json(citaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
};

// Eliminar una cita
export const eliminarCita = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la cita' });
  }
};

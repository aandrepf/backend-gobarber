import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

import Appointment from "./../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import AppError from "../errors/AppError";

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (await findAppointmentInSameDate) {
      throw new AppError("This appointment is already booked");
    }

    // cria a instancia do appontment, mas n salva no banco de dados
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;

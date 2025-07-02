import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // ✅ Create a new appointment
  @Post('create')
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreateAppointmentDto) {
    try {
      const appointment = await this.appointmentService.create(createDto);
      return {
        status: 'success',
        message: 'Appointment created successfully',
        appointment,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to create appointment',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Get an appointment by ID
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const appointment = await this.appointmentService.findById(id);
      if (!appointment) {
        throw new HttpException(
          { status: 'error', message: 'Appointment not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { status: 'success', appointment };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to retrieve appointment',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Update an appointment by ID
  @Put(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    try {
      const updatedAppointment = await this.appointmentService.updateById(id, updateDto);
      if (!updatedAppointment) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Appointment not found or could not be updated',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        status: 'success',
        message: 'Appointment updated successfully',
        updatedAppointment,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to update appointment',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Delete an appointment by ID
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    try {
      const result = await this.appointmentService.deleteById(id);
      if (!result) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Appointment not found or could not be deleted',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return { status: 'success', message: 'Appointment deleted successfully' };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to delete appointment',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Get all appointments by patient phone number
  @Get('phone/:phoneNumber')
  async findByPhone(@Param('phoneNumber') phoneNumber: string) {
    try {
      const appointments = await this.appointmentService.findByPhone(phoneNumber);
      if (!appointments || appointments.length === 0) {
        throw new HttpException(
          { status: 'error', message: 'No appointments found for this patient' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { status: 'success', appointments };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to get appointments',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Get all appointments by doctor email
  @Get('doctor/:email')
  async getByDoctorEmail(@Param('email') email: string) {
    try {
      const appointments = await this.appointmentService.findByDoctorEmail(email);
      if (!appointments || appointments.length === 0) {
        throw new HttpException(
          { status: 'error', message: 'No appointments found for this doctor' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { status: 'success', appointments };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to get doctor appointments',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

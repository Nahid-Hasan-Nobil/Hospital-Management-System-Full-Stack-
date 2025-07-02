import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { LoginPatientDto } from './dto/login-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() createDto: RegisterPatientDto) {
    return this.patientService.register(createDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginPatientDto) {
    const result = await this.patientService.login(
      loginDto.phoneNumber,
      loginDto.password,
    );

    if (!result) {
      return { message: 'Invalid phone number or password' };
    }

    return {
      message: 'Login successful',
      token: result.access_token,
      patient: result.patient,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    return this.patientService.findAll();
  }

  @Get('phone/:phoneNumber')
  @UseGuards(AuthGuard('jwt'))
  async getOne(@Param('phoneNumber') phoneNumber: string) {
    return this.patientService.findOne(phoneNumber);
  }

  @Put('phone/:phoneNumber')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('phoneNumber') phoneNumber: string,
    @Body() updateDto: UpdatePatientDto,
  ) {
    return this.patientService.update(phoneNumber, updateDto);
  }

  @Delete('phone/:phoneNumber')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('phoneNumber') phoneNumber: string) {
    await this.patientService.delete(phoneNumber);
    return { message: 'Patient deleted successfully' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}

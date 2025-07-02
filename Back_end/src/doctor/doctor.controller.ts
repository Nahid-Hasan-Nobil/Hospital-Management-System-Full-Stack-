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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // ✅ Register a new doctor
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() createDto: RegisterDoctorDto) {
    const doctor = await this.doctorService.register(createDto);
    return {
      message: 'Doctor registered successfully',
      doctor,
    };
  }

  // ✅ Login doctor
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDoctorDto) {
    const result = await this.doctorService.login(
      loginDto.email,
      loginDto.password,
    );

    if (!result) {
      return { message: 'Invalid email or password' };
    }

    return {
      message: 'Login successful',
      token: result.access_token,
      doctor: result.doctor,
    };
  }

  // ✅ Get all doctors
  @Get()
  async getAll() {
    return this.doctorService.findAll();
  }

  // ✅ Get doctors by specialty
  @Get('specialty/:specialty')
  async getBySpecialty(@Param('specialty') specialty: string) {
    return this.doctorService.findBySpecialty(specialty);
  }

  // ✅ Get a doctor by email
  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    const doctor = await this.doctorService.findOneByEmail(email);
    if (!doctor) {
      throw new HttpException(
        { message: 'Doctor not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return doctor;
  }

  // ✅ Update doctor info
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDto);
  }

  // ✅ Delete doctor
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.doctorService.delete(id);
    return { message: 'Doctor deleted successfully' };
  }

  // ✅ Forgot password: send OTP
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.doctorService.sendOtp(body.email);
  }

  // ✅ Verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const valid = this.doctorService.verifyOtp(body.email, body.otp);
    return { valid };
  }

  // ✅ Reset password using OTP
  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; otp: string; newPassword: string },
  ) {
    return this.doctorService.resetPassword(
      body.email,
      body.otp,
      body.newPassword,
    );
  }
}

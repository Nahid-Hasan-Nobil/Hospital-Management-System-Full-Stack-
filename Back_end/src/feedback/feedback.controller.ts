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
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * ✅ Create feedback using patientName, phoneNumber, doctorName, doctorEmail
   */
  @Post('create')
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreateFeedbackDto) {
    return this.feedbackService.create(createDto);
  }

  /**
   * ✅ Get all feedbacks for a specific doctor by doctorId
   */
  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId') doctorId: number) {
    return this.feedbackService.findByDoctor(doctorId);
  }

  /**
   * ✅ Get all feedbacks by patient phone number
   */
  @Get('patient/:phoneNumber')
  async findByPatientPhone(@Param('phoneNumber') phoneNumber: string) {
    return this.feedbackService.findByPatientPhone(phoneNumber);
  }

  /**
   * ✅ Update feedback by feedback ID and patient phone number
   */
  @Put(':id')
  async updateByPhone(
    @Param('id') id: number,
    @Body('phoneNumber') phoneNumber: string,
    @Body() updateDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.updateByPhone(id, updateDto, phoneNumber);
  }

  /**
   * ✅ Delete feedback by feedback ID and patient phone number
   */
  @Delete(':id')
  async removeByPhone(
    @Param('id') id: number,
    @Body('phoneNumber') phoneNumber: string,
  ) {
    await this.feedbackService.removeByPhone(id, phoneNumber);
    return { message: 'Feedback deleted successfully' };
  }
}

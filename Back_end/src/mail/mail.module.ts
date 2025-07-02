import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // 👈 export MailService to use it in other modules
})
export class MailModule {}


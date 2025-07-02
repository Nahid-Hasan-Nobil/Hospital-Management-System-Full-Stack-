import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  import { Patient } from '../patient.entity';
  import * as bcrypt from 'bcryptjs';
  
  @EventSubscriber()
  export class PatientSubscriber implements EntitySubscriberInterface<Patient> {
    constructor(dataSource: DataSource) {
      dataSource.subscribers.push(this);
    }
  
    listenTo() {
      return Patient;
    }
  
    beforeInsert(event: InsertEvent<Patient>) {
      console.log(`BEFORE PATIENT INSERTED: `, event.entity);
  
      const patient = event.entity;
      const hashedPassword = bcrypt.hashSync(patient.password, 10);
      patient.password = hashedPassword;
    }
  }
  
import { Component } from '@angular/core';
import { ContactMeService } from '../contact-me/contact-me.service';
import { FormsModule } from '@angular/forms'; // Add this line

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss']
})
export class ContactMeComponent
{
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private contactMeService: ContactMeService) { }

  sendEmail()
  {
    this.contactMeService.sendContactForm(this.contactForm).subscribe(
      response =>
      {
        console.log('Email sent successfully', response);
      },
      error =>
      {
        console.error('Error sending email', error);
      }
    );
  }
}

import { Component } from '@angular/core';
import { ContactMeService } from '../contact-me/contact-me.service';

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
  messageText = '';
  messageType: 'success' | 'error' | 'none' = 'none';

  //test potem na false
  constructor(private contactMeService: ContactMeService) { }

  resetForm()
  {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  sendEmail()
  {
    this.contactMeService.sendContactForm(this.contactForm).subscribe(
      response =>
      {
        this.messageType = 'success';
        this.messageText = 'Message sent successfully';
        this.resetForm();
        this.showTempMessage();
      },
      error =>
      {
        this.messageType = 'error';
        this.messageText = 'Failed to send: ' + error.message;
        this.showTempMessage();
      }
    );
  }

  showTempMessage()
  {
    setTimeout(() => this.messageType = 'none', 30000000);
  }
}

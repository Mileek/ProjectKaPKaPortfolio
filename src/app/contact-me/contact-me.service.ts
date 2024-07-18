import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactMeService
{
  private apiUrl = 'https://localhost:7202/api/contact';

  constructor(private http: HttpClient) { }

  sendContactForm(formData: any): Observable<any>
  {
    return this.http.post(this.apiUrl, formData);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ContactMeService
{
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  sendContactForm(formData: any): Observable<any>
  {
    return this.http.post(this.apiUrl, formData);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';
@Injectable({
  providedIn: 'root'
})
export class EvDataService {
  private dataUrl = 'assets/Electric_Vehicle_Population_Data.csv'; 
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return new Observable(observer => {
      this.http.get(this.dataUrl, { responseType: 'text' }).subscribe(data => {
        Papa.parse(data, {
          header: true,
          complete: result => {
            observer.next(result.data);  
          }
        });
      });
    });
  }
}

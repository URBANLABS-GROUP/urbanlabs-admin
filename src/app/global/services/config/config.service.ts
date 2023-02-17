import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly baseApiUrl: string = `http://10.2.0.57:8080/`
}

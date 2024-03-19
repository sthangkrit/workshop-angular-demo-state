import { Injectable, signal } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
import { Data } from './data';

@Injectable({
  providedIn: 'root',
})
export class DataService {


  //--rxjs--
  // private messageSubject = new BehaviorSubject<string[]>([]);
  // messages$ = this.messageSubject.asObservable();

  // addNewMessage(newMessage: string) {
  //   console.log("newMessage : " + newMessage);
    
  //   this.messageSubject.next([...this.messageSubject.value, newMessage]);
  // }

  // -- data signal only angular 17
  data = signal<Data>({
    messages: []
  });

  addNewMessage(newMessage: string) {
    this.data.update((d) => {
      d.messages.push(newMessage);
      return d;
    });
  }
}

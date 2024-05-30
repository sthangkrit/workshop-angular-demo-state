import { Component } from '@angular/core';
// import { QuestionService } from '@services/question.services';
import { QuestionService } from '../services/question.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  questionCategoryList: any;
  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionService.getQuestionCategoryList().subscribe(
      (res) => {
        console.log('Question Category List:', res);
        this.questionCategoryList = res.data;
      },
      (error) => {
        console.error('getQuestionCategoryList failed:', error);
        Swal.fire({
          title: 'Error!',
          text: 'เกิดข้อผิดพลาด\n กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/']);
          }
        });
      }
    );
  }

  goToCategoryDetail(id: string): void {
    this.router.navigate(['/category', id]);
  }
}

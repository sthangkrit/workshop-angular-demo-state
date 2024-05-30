import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionCategory } from '../models/category';
import { QuestionService } from '../services/question.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  countdown = 900;
  countdownSubscription!: Subscription;
  category: QuestionCategory = {
    questionCategoryId: '',
    title: '',
    totalQuestion: 0,
    level: '',
    timeLimitOfMinuteUnit: 0,
    questionInfo: [],
  };
  currentQuestionIndex = 0;
  totalQuestions = 0;
  checkboxStates: { [key: string]: boolean }[] = [];
  result: any = {
    questionCategoryId: '',
    questions: [],
  };

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // Get the category ID from the route parameters
    const categoryId = this.route.snapshot.paramMap.get('id') ?? '';
    // Fetch the category details based on the ID
    this.questionService.getQuestionCategoryById(categoryId).subscribe(
      (res) => {
        this.category = res.data;
        this.totalQuestions = this.category?.questionInfo?.length ?? 0;
        if (this.category?.timeLimitOfMinuteUnit) {
          this.countdown = this.category.timeLimitOfMinuteUnit * 60;
        }
        this.initializeCheckboxStates();
        this.startCountdown();
      },
      (error) => {
        console.error('Error fetching question category:', error);
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

  startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdownSubscription.unsubscribe();
        this.submitResult();
      }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  }

  initializeCheckboxStates(): void {
    for (let i = 0; i < this.totalQuestions; i++) {
      const checkboxState: { [key: string]: boolean } = {}; // Define type here
      for (const answer of this.category.questionInfo[i].questionAnswerInfo) {
        checkboxState[answer.questionAnswerId] = false;
      }
      this.checkboxStates.push(checkboxState);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onPageChange(page: number): void {
    this.currentQuestionIndex = page - 1;
  }

  updateCheckboxState(answerId: string): void {
    this.checkboxStates[this.currentQuestionIndex][answerId] =
      !this.checkboxStates[this.currentQuestionIndex][answerId];
  }

  isCheckboxChecked(answerId: string): boolean {
    return this.checkboxStates[this.currentQuestionIndex][answerId];
  }

  submitResult(): void {
    this.result.questionCategoryId = this.category.questionCategoryId;
    this.result.questions = this.category.questionInfo.map(
      (question, index) => ({
        questionId: question.questionId,
        answers: question.questionAnswerInfo
          .filter(
            (answer) => this.checkboxStates[index][answer.questionAnswerId]
          )
          .map((answer) => ({ questionAnswerId: answer.questionAnswerId })),
      })
    );

    this.questionService.submitAssignment(this.result).subscribe(
      (response) => {
        console.log('Submission successful:', response);
        Swal.fire({
          title: this.getTitleScore(
            response.data.score,
            response.data.fullScore
          ),
          text: `ผลคะแนนของคุณคือ ${response.data.score}/${response.data.fullScore} คะแนน`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/']);
          }
        });
      },
      (error) => {
        console.error('Submission failed:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem with your submission.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  getTitleScore(score: number, fullScore: number) {
    if (fullScore == score) {
      return 'ดูโพยปะเนี่ย';
    } else if (score < 0) {
      return 'ตอบมั่วนี่นา';
    } else if (fullScore > score && fullScore - score > 5) {
      return 'เกือบเทพแล้ววว';
    }
    return 'ไว้ลองใหม่นะ';
  }
}

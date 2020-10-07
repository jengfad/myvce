import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as jsonData from '../data/az-300.json';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent  {

  allQuestionsLength = jsonData.default.length;

  // CUSTOMIZE QUESTION LIST
  areQuestionsShuffled = true;
  firstQuestion: number = 1;
  endQuestion: number = this.allQuestionsLength;
  // CUSTOMIZE QUESTION LIST

  areChoicesShuffled = true;
  
  currentQuestion: Question;
  showAnswers = false;
  showChoices = false;

  score = 0;
  questionCtr = 0;
  ogList = [];
  totalQuestions = 0;

  currentQuestions: Question[];
  currentChoices: Choice[];

  endOfExam = false;

  wrongItems: Question[] = [];

  alwaysShowChoices = false;

  ngOnInit() {
    this.ogList = jsonData.default.slice(this.firstQuestion - 1, this.endQuestion);
    //this.ogList = this.ogList.filter(x => !x.question.toLowerCase().includes("simulation"))
    this.totalQuestions = this.ogList.length;
    this.currentQuestions = this.areQuestionsShuffled 
                              ? this.shuffle(this.ogList.reverse())
                              : this.ogList.reverse();
    this.getNextQuestion();
  }

  shuffleChoices() {
    this.setCurrentChoices();
  }

  showTheChoices() {
    this.showChoices = true;
  }
  
  getNextQuestion() {

    if (this.currentQuestions.length === 0){
      this.endOfExam = true;
      return;
    };

    this.showChoices = false;
    this.showAnswers = false;
    this.currentQuestion = this.currentQuestions.pop();
    this.questionCtr++;

    let p = document.querySelector('p.question');
    p.innerHTML = this.currentQuestion.question;

    this.setCurrentChoices();
  }

  setCurrentChoices() {
    this.currentChoices = this.areChoicesShuffled 
                            ? this.shuffle(this.currentQuestion.choices)
                            : this.currentQuestion.choices;
  }

  showTheAnswers() {
    this.showAnswers = true;
  }

  submitAnswers() {
    const selected = this.currentChoices.filter(x => x.isSelected).map(x => x.id);
    const correct = this.currentChoices.filter(x => x.isCorrect).map(x => x.id);
    const isUserCorrect = JSON.stringify(selected.sort()) === JSON.stringify(correct.sort());

    console.log(isUserCorrect)

    if (!!isUserCorrect)   
      this.score++;
    else {
      let wrong = {
        question: this.currentQuestion.question.replace(/<br><br>/gi, "\n"),
        choices: this.currentChoices
      };
      this.wrongItems.push(wrong);
    }
    this.getNextQuestion();
  }

  private shuffle(input) {
    // deepclone
    let array = JSON.parse(JSON.stringify(input));
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}

class Choice {
  id: number;
  label: string;
  isCorrect: boolean;
  isSelected: boolean;
}

class Question {
  question: string;
  choices: Choice[];
}
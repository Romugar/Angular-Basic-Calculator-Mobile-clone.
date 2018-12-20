import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, DoCheck {
subDisplay = '';
dataArray = ['0'];
mainDisplay = '';
permitsDot = true;
resultTag = false;
operators = ['/', '*', '-', '+'];

add(value: string) {
  const lastString = this.dataArray[this.dataArray.length - 1];


  switch (value) {
    case '/': case '*': case '-': case '+':
      if (!this.operators.includes(lastString[0]) && lastString[lastString.length - 1] !== '.') {
        this.dataArray.push(value);
        this.permitsDot = true;
        this.resultTag = false;
      }
      break;
    case '.':
      if (lastString.length > 0 && this.permitsDot && !this.operators.includes(lastString[0])) {
        this.dataArray[this.dataArray.length - 1] = this.dataArray[this.dataArray.length - 1] + value;
        this.permitsDot = false;
        this.resultTag = false;
      }
      break;
    case '0':
      if (this.resultTag) {
        this.dataArray = [''];
        this.resultTag = false;
      }
      if (this.operators.includes(lastString[0])) {
        this.dataArray.push(value);
      } else if (lastString[0] !== '0' || lastString.length > 1) {
        this.dataArray[this.dataArray.length - 1] = this.dataArray[this.dataArray.length - 1] + value;
      }
      break;
    default:
      if (this.resultTag) {
        this.dataArray = [''];
        this.resultTag = false;
      }
      if (lastString[0] === '0' && lastString.length === 1) {
        this.dataArray[this.dataArray.length - 1] = value;
      } else if (this.operators.includes(lastString[0])) {
        this.dataArray.push(value);
      } else {
        this.dataArray[this.dataArray.length - 1] = this.dataArray[this.dataArray.length - 1] + value;
      }
    break;
  }
}

cls() {
  this.subDisplay = '';
  this.dataArray = ['0'];
  this.permitsDot = true;
}

del() {
  if (this.resultTag) {
    this.dataArray = ['0'];
    this.resultTag = false;
  }

  let lastString = this.dataArray[this.dataArray.length - 1];
  const deletedValue = this.mainDisplay[this.mainDisplay.length - 1];

  if (this.operators.includes(deletedValue)) {
    this.dataArray.splice(-1, 1);
  } else if (deletedValue === '.') {
    lastString = lastString.slice(0, -1);
    this.dataArray.splice(-1, 1);
    this.dataArray.push(lastString);
    this.permitsDot = true;
  } else if (lastString.length > 1) {
    lastString = lastString.slice(0, -1);
    this.dataArray.splice(-1, 1);
    this.dataArray.push(lastString);
  } else if (lastString.length === 1 && this.dataArray.length > 1) {
    this.dataArray.splice(-1, 1);
  } else {
    this.dataArray = ['0'];
  }
}

calculate() {
  this.resultTag = true;
  this.subDisplay = this.mainDisplay + '=';
  const lastString = this.dataArray[this.dataArray.length - 1];

  if (lastString[lastString.length - 1] === '.') {
    this.dataArray[this.dataArray.length - 1] = this.dataArray[this.dataArray.length - 1].slice(0, -1);
    this.permitsDot = true;
  }

  if (this.operators.includes(this.dataArray[this.dataArray.length - 1])) {
    this.dataArray.splice(-1, 1);
   }

  while (this.dataArray.includes('*') || this.dataArray.includes('/')) {
    const firstCoincidence = this.dataArray.findIndex(function(value) {
      return value === '*' || value === '/';
    });

    if (this.dataArray[firstCoincidence] === '*') {
      const result = Number(this.dataArray[firstCoincidence - 1]) * Number(this.dataArray[firstCoincidence + 1]);
      this.dataArray.splice(firstCoincidence - 1, 3, result.toString());
    }

    if (this.dataArray[firstCoincidence] === '/') {
      const result = Number(this.dataArray[firstCoincidence - 1]) / Number(this.dataArray[firstCoincidence + 1]);
      this.dataArray.splice(firstCoincidence - 1, 3, result.toString());
    }
  }

  while (this.dataArray.includes('+') || this.dataArray.includes('-')) {
    const firstCoincidence = this.dataArray.findIndex(function(value) {
      return value === '+' || value === '-';
    });

    if (this.dataArray[firstCoincidence] === '+') {
      const result = Number(this.dataArray[firstCoincidence - 1]) + Number(this.dataArray[firstCoincidence + 1]);
      this.dataArray.splice(firstCoincidence - 1, 3, result.toString());
    }

    if (this.dataArray[firstCoincidence] === '-') {
      const result = Number(this.dataArray[firstCoincidence - 1]) - Number(this.dataArray[firstCoincidence + 1]);
      this.dataArray.splice(firstCoincidence - 1, 3, result.toString());
    }
  }
  this.dataArray[0] = this.dataArray[0].slice(0, 23);

  if (this.dataArray[0] === 'NaN' || this.dataArray[0] === 'Infinity') {
    this.dataArray = ['0'];
  }
}

ngOnInit() {
  this.mainDisplay = this.dataArray.join('');
}

ngDoCheck() {
  this.mainDisplay = this.dataArray.join('');
}

}


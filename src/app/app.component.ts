import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'app/language/language.service';
import { CurrencyService } from 'app/currency/currency.service';
import { ClickerService } from 'app/clickers/clicker.service';
import { ProgressService } from 'app/progress/progress.service';
import { ContentService } from 'app/content/content.service';
import { SaveService } from 'app/save/save.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isOnClickMeButtonShakeAnimation: boolean = false;

  constructor(
    public content: ContentService,
    public lang: LanguageService, 
    public currency: CurrencyService, 
    public clickers: ClickerService,
    public progress: ProgressService,
    public save: SaveService
    )
  {
    let saveData = this.save.load();
    if( saveData !== undefined)
    { 
      let currentTimestamp = new Date();
      let lastTimestamp = new Date(saveData['timestamp']);
      let msPassed = currentTimestamp.getTime() - lastTimestamp.getTime();
      this.currency.add(0,msPassed/1000 * this.xcps()); 
    }   
  }

  public click()
  {
    this.progress.trigger("button_pressed");

    this.isOnClickMeButtonShakeAnimation = false;
    setTimeout(() => {this.isOnClickMeButtonShakeAnimation = true;},1);

    this.currency.add(0,1);
  }

  private gameTick()
  {
    this.progress.tick();
    for(let i=0; i< this.clickers.total(); i++)
    {
      this.clickers.tick(i);
    }
    this.save.save();
  }

  public xcps()
  {
    let cps: number = 0;
    for(let i=0; i< this.clickers.total(); i++)
    {
      cps += this.clickers.cps(i);
    }
    return Math.floor(10.0*cps)/10.0;    
  }

  ngOnInit()
  {
    setInterval(() => {this.gameTick()},100);
  }
}

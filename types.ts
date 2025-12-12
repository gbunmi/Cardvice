export enum Category {
  Money = 'Money',
  Romance = 'Romance',
  Health = 'Health',
  Social = 'Social',
  Work = 'Work',
  SelfCare = 'Self-Care',
  Family = 'Family',
  DailyHabits = 'Daily Habits',
  Friends = 'Friends',
  DigitalLife = 'Digital Life',
}

export interface AdviceData {
  [key: string]: string[];
}
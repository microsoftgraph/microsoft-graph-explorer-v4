import { translateMessage } from '../../../../utils/translate-messages';

export const uiStringMap: Record<string, string> = {
  Prompt_Title: translateMessage('love your feedback'),
  Prompt_Question: translateMessage('We have just two questions.'),
  Prompt_YesLabel: translateMessage('Sure'),
  Prompt_NoLabel: translateMessage('Sure'),
  Graph_Explorer_Rating_Question: translateMessage('Graph Rating Question'),
  Rating_Values_0: `0 - ${translateMessage('Not at all likely')}`,
  Rating_Values_1: '1',
  Rating_Values_2: '2',
  Rating_Values_3: '3',
  Rating_Values_4: '4',
  Rating_Values_5: '5',
  Rating_Values_6: '6',
  Rating_Values_7: '7',
  Rating_Values_8: '8',
  Rating_Values_9: '9',
  Rating_Values_10: `10 - ${translateMessage('Extremely likely')}`,
  Question_Question: translateMessage('Please tell us more. Why did you choose that answer')
}

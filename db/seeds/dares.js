/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('dares').del()
  await knex('dares').insert(seedCSV());
};

const seedCSV = () => {
  let array = [dareArray.length]
  for(let i=0; i < dareArray.length; i++){
    array[i] = {id: i, text: dareArray[i]}
  }

  return array;
}

const dareArray = [
 ` I dare you to make your funniest monkey face.`,
`  Eat a spoonful of mustard`,
 ` I dare you to make your funniest monkey face`,
 ` Eat a spoonful of mustard`,
 ` Eat a spoonful of mustard`,
 ` I dare you to ask your neighbor for a roll of toilet paper.`,
 ` Sing your favorite song in a funny voice.`,
 ` Sing your favorite song in a funny voice.`,
 ` Sing your favorite song in a funny voice.`,
  `Sing your favorite song in a funny voice.`,
  `Sing your favorite song in a funny voice.`,
  `Sing your favorite song in a funny voice.`,
  `Have you ever lied in truth in truth or dare?`,
 ` Dance like a crazy person on your favorite song.`,
  `Sing your favorite song in a funny voice.`,
  `Sing your favorite song in a funny voice.`,
  `Sing your favorite song in a funny voice.`,
  `Have the person to the left of you do your makeup ... blindfolded.`,
  `Ask a neighbor for a roll of toilet paper.`,
  `What is one annoying habit of each person in the room?`,
 ` Stand in your front yard, wave and say 'Hi!' to everyone you see.`,
  `Moonwalk across the room.`,
  `Pretend that you are underwater for the next 10 minutes.`,
 ` Moonwalk across the room.`,
  `Moonwalk across the room.`,
  `What would you do if you won $100,000,000,000,000?`,
  `Sing your favorite song in a funny voice.`,
 ` What would you do if you won $100,000,000,000,000?`,
 ` What would you do if you won $100,000,000,000,000?.`,
  `Go outside and pour a cup of ice cold water over your head.`,
  `Hold an ice cube in your hand until it melts.`,
  `What would you do if you won $100,000,000,000,000?`,
  `Eat a mouthful of crackers and then try and whistle.`,
 ` Act out a favorite scene from a movie.`,
  `Spin around with your head on a bat 5 times and then jump rope.`,
 ` Say the alphabet backwards as fast as you can.`,
  `Spin around with your head on a bat 5 times and then jump rope.`,
  `For the next hour wear lampshade on your head for a hat.`,
 ` Spin around with your head on a bat 5 times and then jump rope.`,
  `Spin around with your head on a bat 5 times and then jump rope.`,
  `Go into the front yard and do the chicken dance for one minute. Don't forget to bark. `,
]



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('truths').del()
  await knex('truths').insert(seedCSV());
};

const seedCSV = () => {
  let array = [truthArray.length]
  for(let i=0; i < truthArray.length; i++){
    array[i] = {id: i, text: truthArray[i]}
  }

  return array;
}

var truthArray = [
  `If you were marooned on an island with just a single person, who would you like it to be?`,
  `If you woke up one day and notice, that you are invisible, then what will be the first thing that you would like to do?`,
  `What is the question that you do not want anyone to ask you in this game?`,
  `What was the joke you ever played on someone?`,
  `If you could have anything in the world, what would it be?`,
  `What is the strangest dream you've ever had? `,
  `Have you ever lied to a teacher and what was it about?`,
  `Do you sneak snacks when your Mom isn't looking?`,
  `What's the dumbest thing you ever said or did, around a pet you liked?`,
  `Who was your first nickname?`,
  `Who is the person in the room who you hate the most?`,
  `What was the most boring joke you've ever told?`,
  `What was the most embarrassing dream you've ever had?`,
  `What is your worst fear?`,
  `Who was your first nickname?`,
  `Who is the person in the room who you hate the most?`,
  `What was the most boring joke you've ever told?`,
  `What was the most embarrassing dream you've ever had?`,
  `What is your worst fear?`,
  `If you were marooned on an island with just a single person, who would you like it to be?`,
  `If you woke up one day and notice, that you are invisible, then what will be the first thing that you would like to do?`,
  `What is the question that you do not want anyone to ask you in this game?`,
  `If you could have anything in the world, what would it be?`,
  `What is the strangest dream you've ever had?`,
  `What do you like the most about everyone in the room?`,
  `Have you ever lied to a teacher and what was it about?`,
  `Do you sneak snacks when your Mom isn't looking?`,
  `What's the dumbest thing you ever said or did, around a pet you liked?`,
  `What is the worst gift you have ever received?`,
  `What's the strangest obsession you've ever had?` ,
  `Who was the first person you met`,
  `Who is your brother right now?`,
  `What is the most embarrassing thing that happened to you?`,
  `What is one talent most people here dont know you have?`,
  `Have you ever lied for Truth or Dare?`
]
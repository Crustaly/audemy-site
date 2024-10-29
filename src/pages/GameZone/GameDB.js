const basedPath = "./src/assets/gameImages/buttons/gameButtons/";
export const getLanguageGames = () => {
  return [
    {
      icon: basedPath + "spellingBee.svg",
      title: "Spelling Bee",
      //url: "/game/spelling-bee",
      url: "/game/spellingbee",
      textColor: "#5391AC",
      bgColor: "#EAF7FD",
    },
    {
      icon: basedPath + "oddOneOut.svg",
      title: "Odd One Out",
      url: "/game/oddoneout",
      textColor: "#DA6301",
      bgColor: "#FFDABA",
    },
    {
      icon: basedPath + "storyBuilder.svg",
      title: "Polar Pairing",
      url: "/game/polarpairing",
      textColor: "#769400",
      bgColor: "#DAF5B7",
    },
    {
      icon: basedPath + "vocabularyVortex.svg",
      title: "Vocabulary Vortex",
      url: "/game/vocabVortex",
      textColor: "#269C9A",
      bgColor: "#DAF7F6",
    },
  ];
};

export const getMathGames = () => {
  return [
    {
      icon: basedPath + "animalAddition.svg",
      title: "Animal Addition",
      url: "/game/addition",
      textColor: "#269C9A",
      bgColor: "#DAF7F6",
    },
    {
      icon: basedPath + "subtractionSafari.svg",
      title: "Subtraction Safari",
      url: "/game/subtraction",
      textColor: "#769400",
      bgColor: "#DAF5B7",
    },
    {
      icon: basedPath + "multiplicationMadness.svg",
      title: "Multiplication Madness",
      url: "/game/multiplicationmadness",
      textColor: "#9771EF",
      bgColor: "#D5D1FF",
    },
    {
      icon: basedPath + "divisionDual.svg",
      title: "Division Duel",
      url: "game/DivisionDuel",
      textColor: "#DA6301",
      bgColor: "#FFDABA",
    },
  ];
};

export const translateGameType = (type) => {
  switch(type) {
    case 'language': return 'Language Lab';
    case 'math': return 'Math Magic';
    default: return type;
  }
}

export const translateSlug = (slug) => {
  const games = getLanguageGames().concat(getMathGames());
  return games.filter(game => game.url.includes(slug)).pop().title ?? slug;
}

export const getGamePercentual = (games) => {
  if (!games || games.length === 0) return { pendentJourney: 0, journey: 0 };
  let allGames = [];
  switch (games[0].gameType) {
    case  'language':
      allGames = getLanguageGames();
      break;
    case  'math':
      allGames = getMathGames();
      break;
    default:
      allGames = [];
      break;
  }
  const total = allGames.length * 3;
  let userLevel = 0;
  games.forEach(game => {
    switch(game.level) {
      case 'Beginner':
        userLevel += 1;
        break;
      case 'Intermediate':
        userLevel += 2;
        break;
      case 'Advanced':
        userLevel += 3;
        break;
      default: 
        userLevel += 0;
        break;
    }
  });
  const pendentJourney = total - userLevel; 
  const journey = (userLevel / total) * 100;
  return { pendentJourney, journey };
}

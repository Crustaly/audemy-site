<script setup>
  import ProgressCard from './ProgressCard/ProgressCard.vue'
  import { ref } from 'vue'
  import { translateGameType } from '../GameDB'

  const authenticated = ref(true);

  const errors = ref(false);
  const email = ref('');
  const password = ref('');

  const login = (event) => {
    event.preventDefault();
    errors.value = false;

    if (!email.value || !password.value) {
      errors.value = true;
      resetErrors();
      return;
    }
  }

  const resetErrors = () => {
    setTimeout(() => {
      errors.value = false;
    }, 4000);
  }

  const userExemple = {
    name: 'User test',
    games: [
      {
        gameType: 'language',
        slug: 'oddoneout',
        level: 'Beginner'
      },
      {
        gameType: 'language',
        slug: 'spellingbee',
        level: 'Advanced'
      },
      {
        gameType: 'math',
        slug: 'subtraction',
        level: 'Intermediate'
      },
    ]
  };
  
  /*
  Used user data type:
  {
  name: String,
  games: Relation to user_has_game
  }

  Used user_has_game data type:
  {
    gameType: String,
    slug: String,
    level: String
  }
  */
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-[80%]">
      <div v-if="!authenticated" class="flex flex-col justify-center my-24 w-full">
        <h2 class="font-poppins text-4xl tablet:text-[26px] mobile:text-[24px] text-center font-[400]">
          Login in to Audemy</h2>
        <form @submit="login" class="max-w-[30%] w-full flex flex-col items-start justify-center self-center mt-16">
          <div class="mt-8 mb-3" v-if="errors">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span class="block sm:inline text-center">Invalid email and password combination. Try again!</span>
            </div>
          </div>
          <div class="mb-[16px] w-full">
            <label class="block text-[#0C0D0D] mb-1 font-semiBold" for="emai">Email Address</label>
            <input v-model="email" type="email" class="w-full outline-none border-2 border-black py-2 px-2 rounded-[8px]"
              id="email" name="email" placeholder="Enter your email address">
          </div>
          <div class="mb-[16px] w-full">
            <label for="password" class="block text-[#0C0D0D] mb-1 font-semiBold">Password</label>
            <input v-model="password" type="password"
              class="w-full outline-none border-2 border-black py-2 px-2 rounded-[8px]" id="password" name="password"
              placeholder="Enter your password">
          </div>
          <div class="flex justify-center w-full mt-7 mb-5">
            <button type="submit" class="w-full py-3 font-bold rounded-[8px] font-bold"
              :class="errors ? 'bg-[#747575] text-white' : 'bg-[#087BB4] hover:bg-[#ff8d33] border-2 border-black shadow-[4px_4px_0px_black] text-white'"
              :disabled="errors">Log in</button>
          </div>
          <div class="flex justify-start w-full mb-9">
            <a href="" class="underline text-[#087BB4] font-medium">Forgot your password?</a>
          </div>
          <div class="flex justify-center w-full">
            <h5>New to Audemy? <a href="./signup" class="underline text-[#087BB4] font-medium">Sign Up</a></h5>
          </div>
        </form>
      </div>

      <div v-if="authenticated" class="flex flex-col justify-center my-24">
        <h2 class="font-poppins text-4xl tablet:text-[26px] mobile:text-[24px] text-center font-[400] mb-20">
          {{userExemple.name}}, unlock new levels with Carl! </h2>
          <div class="flex flex-col justify-center gap-16">
            <ProgressCard :title="translateGameType('language')" :games="userExemple.games.filter(g => g.gameType === 'language')" />
            <ProgressCard :title="translateGameType('math')" :games="userExemple.games.filter(g => g.gameType === 'math')" />
          </div>
      </div>
    </div>
  </div>
</template>
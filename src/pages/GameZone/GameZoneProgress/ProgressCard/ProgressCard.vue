<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { translateSlug, getGamePercentual } from '../../GameDB';
const props = defineProps({
  title: String,
  games: Array
});

const currentGames = ref([]);
const gameLevelSetting = ref({ pendentJourney: 0, journey: 0 });
onMounted(() => {
  currentGames.value = props.games.slice(0, 4);
  const { pendentJourney, journey } = getGamePercentual(props.games);
  gameLevelSetting.value.pendentJourney = pendentJourney;
  gameLevelSetting.value.journey = journey;
});
</script>

<template>
  <div class="h-[680px] w-full border-2 border-black rounded-[8px] pb-10">
    <h2 class="font-poppins text-4xl tablet:text-[26px] mobile:text-[24px] text-center font-[400] mt-16 mb-10">
      {{ title }}</h2>
    <div class="w-full py-5 flex flex-col justify-between items-center h-[80%]">
      <div class="w-11/12 flex justify-around h-[70%]">
        <div class="w-3/12 flex flex-col justify-end items-end gap-5" v-for="game in currentGames">
          <div class="w-full flex justify-center items-end h-full">
            <div class="w-[80%] bg-[#C2C8CB]"
              :class="game.level == 'Beginner' ? 'h-[45%]' : (game.level == 'Intermediate' ? 'h-[75%]' : 'h-[100%]')">
            </div>
          </div>
          <div class="w-full">
            <h2 class="font-poppins text-2xl tablet:text-[26px] mobile:text-[24px] text-center font-[400]">
              {{ translateSlug(game.slug) }}</h2>
            <h3
              class="font-poppins text-small-text-color text-[12px] font-[500] mobile:w-auto text-center tracking-[3.6px] mb-4 text-[#6E777C] font-semibold">
              {{ game.level }}</h3>
          </div>
        </div>
      </div>
      <div class="w-10/12 flex items-center justify-between h-[20%]">
        <div class="w-3/12">
          <h2 class="font-poppins text-2xl tablet:text-[26px] mobile:text-[24px] text-start font-[400]">
            {{gameLevelSetting.journey.toFixed(2)}}% achieved
          </h2>
          <h3
            class="font-poppins text-small-text-color text-[12px] font-[500] mobile:w-auto text-start tracking-[3.6px] text-[#6E777C] font-semibold">
            {{gameLevelSetting.pendentJourney}} more levels to unlock
          </h3>
        </div>
        <div class="w-9/12 relative">
          <div class="w-full h-[24px] bg-[#C2C8CB] rounded-lg max-w-[100%]">
            <div class="bg-[#087BB4] h-full rounded-lg" :style="{'width': gameLevelSetting.journey.toFixed(2)+'%'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <!-- Widgets-->
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="domain" title="287" :subTitle="$t('widgetHigherYesterday', ['13m'])" :supTitle="$t('Todays distance')" color="#00b297"/>
      </v-flex>
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="money_off" title="274" :subTitle="$t('saving', ['$11'])" :supTitle="$t('Today cost')" color="#dc3545"/>
      </v-flex>
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="computer" title="33.45%" :subTitle="$t('Average Detection', ['13%'])"  :supTitle="$t('Unique Paths')" color="#0866C6"/>
      </v-flex>
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="watch_later" title="13.00%" :subTitle="$t('Detection Time', ['17.25%'])" :supTitle="$t('widgetBounceRate')" color="#1D2939"/>
      </v-flex>
      <!-- Widgets Ends -->
      <!-- Statistics -->
      <v-flex d-flex lg4 sm6 xs12>
        <site-view-statistic/>
      </v-flex>
      <v-flex d-flex lg4 sm6 xs12>
        <location-statistic/>
      </v-flex>
      <v-flex d-flex lg4 sm6 xs12>
        <total-earnings-statistic/>
      </v-flex>
      <!-- Statistics Ends -->
      <!-- DataTable&TimeLine Starts -->
      <v-flex d-flex lg8 sm6 xs12>
        <data-table/>
      </v-flex>
      <v-flex d-flex lg4 sm6 xs12>
        <time-line />
      </v-flex>
      <!-- DataTable&TimeLine Ends -->
      <v-flex d-flex lg6 sm6 xs12>
        <stepper/>
      </v-flex>
      <v-flex d-flex lg6 sm6 xs12>
        <user-tree-view />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando.`
    }
  }
}
</script>

<style>

</style>

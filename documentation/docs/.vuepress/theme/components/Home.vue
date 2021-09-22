<template>
  <main
    class="home"
    aria-labelledby="main-title"
  >
    <header class="hero">
      <img
        v-if="data.heroImage"
        :src="$withBase(data.heroImage)"
        :alt="data.heroAlt || 'hero'"
      >
      <div v-if="data.heroVideo" class="youtube" style="margin: 3rem auto 1.5rem; width: 390px">
        <video
          v-if="data.heroVideo"
          width="100%"
          :src="$withBase(data.heroVideo)"
          autoplay loop muted
        />
      </div>
      

      <div class="text">
        <h1
          v-if="data.heroText !== null"
          id="main-title"
        >
          {{ data.heroText || $title || 'Hello' }}
        </h1>

        <p
          v-if="data.tagline !== null"
          class="description"
        >
          {{ data.tagline || $description || 'Welcome to your VuePress site' }}
        </p>

        <p
          v-if="data.actionText && data.actionLink"
          class="action"
        >
          <a 
            class="action-button"
            :href="data.actionLink">
            {{ data.actionText }}
          </a>
          <!-- <NavLink
            class="action-button"
            :item="actionLink"
          /> -->
        </p>
      </div>
    </header>

    <div v-if="data.usage && data.usage.length" class="section">
      <h2>Usage</h2>
      <div class="grid two-three" v-for="(use, index) in data.usage" :key="index">
        <div >
          <img v-if="use.img" :src="use.img" :alt="use.title">
        </div>
        <div>
          <h3>{{ use.title }}</h3>
          <p><span v-html="use.details"></span></p>
        </div>
      </div>
    </div>
    <!-- <div v-if="data.usage && data.usage.length" class="section">
      <h2>Usage</h2>
      <div class="grid" >
        <div v-for="(use, index) in data.usage"
        :key="index">
          <img v-if="use.img" :src="use.img" :alt="use.title">
          <h3>{{ use.title }}</h3>
          <p><span v-html="use.details"></span></p>
        </div>
      </div>
    </div> -->

    <div v-if="data.updates && data.updates.length" class="section">
      <!-- <h2>Updates</h2> -->
      <div class="grid half" >
        <div v-for="(use, index) in data.updates"
        :key="index">
          <img v-if="use.img" :src="use.img" :alt="use.title">
          <h3>{{ use.title }}</h3>
          <!-- <p>{{ use.details }}</p> -->
          <p><span v-html="use.details"></span></p>
        </div>
      </div>
    </div>

    <div v-if="data.addons && data.addons.length" class="section">
      <!-- <h2>Details</h2> -->
      <div class="grid two-three" v-for="(use, index) in data.addons" :key="index">
        <div >
          <img v-if="use.img" :src="use.img" :alt="use.title">
          <div v-if="use.video" class="youtube" style="margin: 3rem auto 1.5rem; width: 390px">
            <video
              v-if="use.video"
              width="100%"
              :src="$withBase(use.video)"
              autoplay loop muted
            />
          </div>
        </div>
        <div>
          <h3>{{ use.title }}</h3>
          <p><span v-html="use.details"></span></p>
        </div>
      </div>
    </div>
    

    <!-- <div
      v-if="data.features && data.features.length"
      class="features"
    >
      <div
        v-for="(feature, index) in data.features"
        :key="index"
        class="feature"
      >
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div> -->

    <!-- <Content class="theme-default-content custom" /> -->

    <div class="section">
      <h2>Install</h2>
      <img :src="$withBase('./images/CC2019-Install.png')" class="screenshot right" style="width: 450px; margin-top: 16px">
      <h3>2019+</h3>
      <div>
        <div>
          <p>In newer versions of After Effects, it is possible to install RubberHose 2 and other scripts without digging through your hard drive.</p>
            <code>File > Scripts > Install Script UI Panel…</code>
          <p>Restart Ae and <b>InspectorSpacetime</b> will be available in the <b>Window</b> menu at the top of the screen. Scroll down to find the installed scripts</p>
        </div>
        
      </div>
      <h3>2018 and older</h3>
      <ul>
        <li>Unzip the <b>InspectorSpacetime.zip</b> download</li>
        <li>Copy <b>InspectorSpacetime.jsx</b> do the ScriptUI Panels folder</li>
        <li>Restart After Effects</li>
        <li><b>InspectorSpacetime</b> will be available in the <b>Window</b> menu at the top of the screen. Scroll down to find the installed scripts</li>
      </ul>
    </div>


    <div class="section">
      <h2>Why the dumb name?</h2>
      <div class="youtube" style="margin-top: 8px">
        <Video url="https://www.youtube.com/embed/WQAgPaJvvHU" />
      </div>
      

      <p>The tool is named after the Doctor Who parody from the underrated NBC comedy <i>Community</i>. The series really falls apart at the end but it's mostly pretty amazing.</p>
      <p>In<u>spec</u>tor Spacetime. It's a bad pun. I'm a dad. I can't help it.</p>
    </div>
    <br />


    <div
      v-if="data.footer"
      class="footer"
      v-html="data.footer"
    >
      <!-- {{ data.footer }} -->
    </div>
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'

export default {
  name: 'Home',

  components: { NavLink },

  computed: {
    data () {
      return this.$page.frontmatter
    },

    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  },
  filters: {
    textPrep (str) {
      return str.replace(/\\n/g, '<br />')
    }
  }
}
</script>

<style lang="stylus">
header
  display flex
  padding 8rem 0 4rem 0
.home
  padding $navbarHeight 2rem 0
  max-width $homePageWidth
  margin 0px auto
  display block
  .hero
    text-align center
    img
      max-width: 100%
      max-height 280px
      display block
      margin 3rem auto 1.5rem
    h1
      font-size 3rem
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color lighten($textColor, 40%)
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      padding 0.8rem 1.6rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)
  .features
    border-top 1px solid $borderColor
    padding 1.2rem 0
    margin-top 2.5rem
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature
    flex-grow 1
    flex-basis 30%
    max-width 30%
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    p
      color lighten($textColor, 25%)
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    // color lighten($textColor, 25%)
  .section 
    // border-top 1px solid $borderColor
    margin-top 64px
  .screenshot
    height auto
    margin 0 0 16px 0
    max-width 100%
  .right
    float right
    margin-left 16px
  img
    width 100%   
  .grid
    display grid
    grid-template-columns 1fr 1fr 1fr
    gap 32px 32px
    margin-top 16px
  .half 
    grid-template-columns 1fr 1fr
  .two-three 
    grid-template-columns 0.4fr 0.6fr
  br
    clear both
  .youtube
    width 50%
    padding 0 8px
    margin-left 16px
    float right
    height auto
    

@media (max-width: $MQMobile)
  .home
    .features
      flex-direction column
    .feature
      max-width 100%
      padding 0 2.5rem
    img
      margin-left auto
      margin-right auto
      float none
    .grid
      grid-template-columns 3fr
    .grid>*
      max-width 400px
      margin 0 auto
    .youtube
      width 100%
      margin-left auto
    header
      padding 2rem 0 0

@media (max-width: $MQMobileNarrow)
  .home
    padding-left 1.5rem
    padding-right 1.5rem
    .hero
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 2rem
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature
      h2
        font-size 1.25rem
</style>

var Theme = {
    themesRed: {
      primary0: "#5B0404",
      primary1: "#861C1C",
      primary2: "#D77272",
      primary3: "#FFB0B0",
      primary4: "#AE3F3F"
    },
    themesFlax: {
      primary0: "#5B3304",
      primary1: "#86551C",
      primary2: "#D7A872",
      primary3: "#FFDAB0",
      primary4: "#AE7A3F"
    },
    themesGreen: {
      primary0: "#275103",
      primary1: "#447819",
      primary2: "#659B38",
      primary3: "#8EC065",
      primary4: "#BDE49E"
    },
    themesLightBlue: {
      primary0: "#023735",
      primary1: "#11524F",
      primary2: "#458380",
      primary3: "#6D9E9C",
      primary4: "#266A67"
    },
    themesPurple: {
      primary0: "#2B053D",
      primary1: "#44165A",
      primary2: "#7B4F8F",
      primary3: "#9C7AAD",
      primary4: "#5D2E74"
    },
    themesGray: {
      primary0: "#292626",
      primary1: "#615F5F",
      primary2: "#8E8D8D",
      primary3: "#BAB8B8",
      primary4: "#EDEBEB"
    },

    randomTheme: function () {
      var themes = [this.themesRed, this.themesFlax, this.themesGreen, this.themesLightBlue, this.themesPurple, this.themesGray];
      var themeIndex = parseInt(Math.random() * themes.length);
      return themes[themeIndex];
    }
}

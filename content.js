const getStatsAsync = async () => {
  const statsURL = 'https://m-league.jp/stats/';
  try {
    const response = await fetch(statsURL);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const statsHTML = await response.text();
    return statsHTML;
  } catch (error) {
    throw error;
  }
};

window.addEventListener('load', async () => {
  try {
    const html = await getStatsAsync();
    const parser = new DOMParser();
    const statsDocument = parser.parseFromString(html, 'text/html');
    const team = {
      T001: {name: 'ドリブンズ', games: 0},
      T002: {name: '風林火山', games: 0},
      T008: {name: 'サクラナイツ', games: 0},
      T003: {name: '麻雀格闘倶楽部', games: 0},
      T004: {name: 'ABEMAS', games: 0},
      T005: {name: 'フェニックス', games: 0},
      T006: {name: '雷電', games: 0},
      T010: {name: 'BEAST', games: 0},
      T007: {name: 'Pirates', games: 0},
    };
    // from 2023-2024 season
    const regularSeasonGames = 96;
    Object.keys(team).forEach(id => {
      const sectionElement = statsDocument.getElementById(id);
      const tdElements = sectionElement.querySelectorAll('.p-stats__table tr:nth-child(2) td');
      tdElements.forEach(element => team[id].games += parseInt(element.textContent));
    });
    const teamNameElements = document.getElementsByClassName('p-ranking__team-name');
    Array.prototype.forEach.call(teamNameElements, element => {
      const teamName = element.textContent;
      const {games} = Object.values(team).find(t => t.name === teamName);
      element.innerText = `${teamName}\n(${games} /${regularSeasonGames})`;
    });
  } catch (e) {
    alert('Chrome拡張機能 Mリーグ試合数表示\nデータの取得に失敗しました。しばらくしてから再度お試しください。');
  }
});

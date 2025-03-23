document.addEventListener("DOMContentLoaded", () => {
    const schedule_year = document.querySelector('#schedule-year');
    const schedule_months = document.querySelector('#schedule-months');
    const schedule_days = document.querySelector('#schedule-days');

    /**
     * 現在の年月日を検知して該当対象に selected 属性を付与する関数
     * @param {string} targetSelect                 // 対象 select　の名称
     * @param {number} i                            // ループの index 数
     * @param {HTMLOptionElement} targetElm_option  // 生成する option 要素
     */
    const _checkCurrentAndSelected = (targetSelect, i, targetElm_option) => {
        if (targetSelect === 'year') {
            const currYear = new Date().getFullYear();
            if (i === currYear) {
                targetElm_option.setAttribute('selected', 'true');
            }
        } else if (targetSelect === 'month') {
            const currMonth = new Date().getMonth() + 1;
            if (i === currMonth) {
                targetElm_option.setAttribute('selected', 'true');
            }
        }
    }

    /**
     * 各 select の option を生成する関数
     * @param {number} loopStart                        // ループの開始数
     * @param {number} loopFinish                       // ループの終了数
     * @param {HTMLSelectElement} targetElm             // 対象 select
     * @param {string} targetSelect                     // 対象 select　の名称
    */
    const createEachSelectOptions = (loopStart, loopFinish, targetElm, targetSelect = undefined) => {
        for (let i = loopStart; i <= loopFinish; i++) {
            const option = document.createElement('option');
            option.textContent = i;
            option.setAttribute('value', i);
            option.setAttribute('name', targetElm.getAttribute('name'));

            if (targetSelect !== undefined) {
                _checkCurrentAndSelected(targetSelect, i, option);
            }

            targetElm.appendChild(option);
        }
    }

    /**
     * 各月に準ずる日を生成
     * @param {number} selectedYear     // 選択した年（指定なしの場合は今年）
     * @param {number} selectedMonth    // 選択した月（指定なしの場合は今月）
     * @returns number
     */
    const _createCurrYearMonth_days = (selectedYear, selectedMonth) => {
        const theYear = selectedYear ?? new Date().getFullYear();
        const theMonth = selectedMonth ?? new Date().getMonth() + 1;
        const targetYearMonth_lastDate = new Date(theYear, theMonth, 0).getDate();
        return targetYearMonth_lastDate;
    }

    /**
     * 
     * @param {HTMLSelectElement} targetSelectedElm // 対象 select（年または月）
     * @param {string} theValue                     // select.target.value
     * @param {boolean} isMonth                     // 月かどうかを判定（_createCurrYearMonth_days用）
     */
    const _changeDataCoreAction = (targetSelectedElm, theValue, isMonth) => {
        const selectedElm = Array.from(targetSelectedElm.children).filter(elm => elm.getAttribute('selected')).map(elm => elm.textContent)[0];  // selected 属性が付与された対象 option の文字列（月）を取得
        const targetYearMonth_lastDate = isMonth ?
            _createCurrYearMonth_days(parseInt(selectedElm), theValue) :
            _createCurrYearMonth_days(theValue, parseInt(selectedElm));
        schedule_days.innerHTML = ""; // 日数 option の初期化
        createEachSelectOptions(1, targetYearMonth_lastDate, schedule_days);
    }

    /**
     * 年と月の select 要素のイベントハンドラーによる日数の変更調整
     * @returns void
     */
    const changeData = () => {
        const theYearAndMonth = [schedule_year, schedule_months];
        for (const theEventListener of theYearAndMonth) {
            theEventListener.addEventListener('change', (e) => {
                const theName = e.target.name;
                const theValue = e.target.value;

                /* option の selected 属性を調整（初期化及び対象 option に selected 付与）*/
                for (const targetOption of Array.from(e.target.children)) {
                    targetOption.removeAttribute('selected');
                    if (theValue === targetOption.getAttribute('value')) {
                        targetOption.setAttribute('selected', 'ture');
                    }
                }

                if (theName === 'schedule-year') {
                    _changeDataCoreAction(schedule_months, theValue, false);
                } else if (theName === 'schedule-months') {
                    _changeDataCoreAction(schedule_year, theValue, true);
                } else {
                    console.error('exception occurred.');
                }
            });
        }
    }
    changeData();

    /* 各年の生成 */
    const startYear = 1990;
    const currYear = new Date().getFullYear();
    createEachSelectOptions(startYear, currYear, schedule_year, 'year');

    /* 各月の生成 */
    createEachSelectOptions(1, 12, schedule_months, 'month');

    /* 日数の生成 */
    const targetYearMonth_lastDate = _createCurrYearMonth_days();
    createEachSelectOptions(1, targetYearMonth_lastDate, schedule_days);
});
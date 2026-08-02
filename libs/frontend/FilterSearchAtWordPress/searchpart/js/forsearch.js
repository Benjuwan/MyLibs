document.addEventListener("DOMContentLoaded", () => {

    // 検索結果ページでの検索ボックスの表示ボタン関連
    const SearchAgainBtn = document.querySelector('.searchAgain button');
    function ToggleSearchBox() {
        const SearchDetailsBox = document.querySelector('#search_details_box');
        SearchAgainBtn.addEventListener('click', () => {
            SearchDetailsBox.classList.toggle('SearchInview');
        });
    }
    if (SearchAgainBtn !== null) {
        ToggleSearchBox();
    }

    // セレクトボックスを選択して表示の切り替え（ selectと'change'イベント ）
    const echoIdAttr = document.querySelector('#echoIdAttr');
    function SearchSelect() {
        const UniBox = document.querySelector('#uniBox');
        const VocBox = document.querySelector('#VocBox');

        echoIdAttr.addEventListener('change', () => {
            VocBox.classList.toggle('inview');
            UniBox.classList.toggle('inview');
        });
    }
    if (echoIdAttr !== null) {
        SearchSelect();

        /**
         * 【ios対策】
         * 冗長なコードになるが細かく指定してあげないとiosは認識してくれない
         * *1：はじめに、「各option」にselectedを指定
         * *2：次に、条件（$ConstSearchTargets-001 || $ConstSearchTargets-002）に応じて不要なoptionからselectedを削除
         */

        // 表示中のページURLにsearchs-slug001（カテゴリ別スラッグ）が含まれている場合
        if (location.href.match('searchs-slug001')) {
            echoIdAttr.querySelectorAll('option').forEach(op => { // *1
                op.setAttribute('selected', true);
            });

            const uniSelect = echoIdAttr.querySelector('option[value="searchs-slug002"]');
            uniSelect.removeAttribute('selected'); // *2:上記valueを持つoptionタグに対して

            document.querySelector('#uniBox').classList.add('inview');
            document.querySelector('#VocBox').classList.remove('inview'); // 当該カテゴリに対応する内容を表示

        } else { // 表示中のページURLにsearchs-slug002（カテゴリ別スラッグ）が含まれている場合
            echoIdAttr.querySelectorAll('option').forEach(op => { // *1
                op.setAttribute('selected', true);
            });

            const vocSelect = echoIdAttr.querySelector('option[value="searchs-slug001"]');
            if (vocSelect !== null) {
                vocSelect.removeAttribute('selected'); // *2:上記valueを持つoptionタグに対して

                document.querySelector('#VocBox').classList.add('inview');
                document.querySelector('#uniBox').classList.remove('inview'); // 当該カテゴリに対応する内容を表示
            }
        }
    }


    // 検索クエリが空（null：%5B%5D[]）のものは表示から削除 
    const SelectValue = document.querySelectorAll('#array_word small');
    SelectValue.forEach(Selectvalues => {
        if (!Selectvalues.innerHTML.length > 0) {
            Selectvalues.remove();
        }
    });


    // 検索項目をlocalStorageに残して検索結果に反映（ここから）
    const SubmitForm = document.querySelector('#searchform');
    const SubmitBtn = document.querySelector('#department_btn input');
    const Action = [SubmitForm, SubmitBtn];
    if (SubmitForm || SubmitBtn) {
        Action.forEach(action => {
            action.addEventListener('submit', () => {
                LocalSaved(); // LocalSaved関数を「実行したタイミング」でlocalStorageに保存
            });
        });
    }

    // 検索項目のinput
    const Inputs = document.querySelectorAll('details summary label input');

    /**
     * LocalSaved関数を「実行したタイミング」でlocalStorageに保存
     * *1：inputの中でcheckedが付いているものを選別
     * *2：checkedが付いているものを保存
     */
    function LocalSaved() {
        let InputBox = [];
        Inputs.forEach(Input => {
            if (Input.checked == true) { // *1
                const InputValue = Input.getAttribute('value');
                InputBox.push(InputValue); // *2 
            }
        });
        localStorage.setItem('InputBox', JSON.stringify(InputBox));
    }

    /**
     * （checkedが付いているものを保存した）localStorageがある場合の処理
     * *1：inputのvalueと同じvalue（InputValue）がある場合
     * *2：checked属性を付与
     */
    const GetLocalStorage = JSON.parse(localStorage.getItem('InputBox'));
    if (GetLocalStorage) {
        GetLocalStorage.forEach(InputValue => {
            Inputs.forEach(Input => {
                if (Input.getAttribute('value') == InputValue) { // *1
                    Input.setAttribute('checked', true); // *2
                }
            });
        });
    }

    // localStorage（検索履歴）を削除
    if (GetLocalStorage && GetLocalStorage.length > 0) {
        const SearchHeadLine = document.querySelector('#SearchMainWrapper h3');
        const resetBtn = document.createElement('span');
        resetBtn.innerHTML = '【検索履歴(けんさくりれき)を削除(さくじょ)する】';
        resetBtn.style.fontSize = "12px";
        resetBtn.style.color = "red";
        resetBtn.style.cursor = "pointer";
        if (SearchHeadLine) {
            SearchHeadLine.appendChild(resetBtn);
        }
        resetBtn.addEventListener('click', () => {
            resetBtn.innerHTML = "検索履歴(けんさくりれき)を削除(さくじょ)しました";
            localStorage.removeItem('InputBox');
            Inputs.forEach(Input => {
                Input.removeAttribute('checked'); // 選択済み項目のcheckedを外す
            });
        });
    }
    // 検索項目をlocalStorageに残して検索結果に反映（ここまで）

    // 絞り込み検索結果ページでのtitleタグへの表記
    if (location.href.match('get_') && document.querySelector('#SerachKeywords') === null) {
        const Titletag = document.querySelector('title');
        const SerachTxt = document.querySelector('#array_word');
        const SerachWords = SerachTxt.querySelectorAll('small');
        const SerachTxtBox = [];
        SerachWords.forEach(sWord => {
            SerachTxtBox.push(sWord.textContent);
        });
        Titletag.textContent = `検索結果：[${SerachTxtBox}] | 検索結果ページ`;
    }

});
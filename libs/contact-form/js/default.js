document.addEventListener("DOMContentLoaded", () => {
    console.log('js/default.js');

    /**
     * 各SNSラベルをクリックすると当該SNSの連絡先IDを入力するフォームが表示されて当該 input要素に特定の name属性値が付与される
     * @param {HashChangeEvent:<HTMLInputElement>} e 
     * @param {HTMLInputElement} snsIds 
     */
    const checkCheckedSNSlables_ViewEntryIdForm = (e, snsIds) => {
        if (e.target.checked) {
            snsIds.removeAttribute('hidden');
            snsIds.querySelector('input').setAttribute('name', `${e.target.value}-id:`);
            snsIds.classList.add('snsIdsView');
        } else {
            snsIds.setAttribute('hidden', 'true');
            snsIds.querySelector('input').removeAttribute('name');
            snsIds.classList.remove('snsIdsView');
        }
    }

    /**
     * .snsIdsView {
        margin-top: .5em;
        padding-left: 1.5em;
        }
    */

    const theCheckers = document.querySelectorAll('.theCheckers');
    for (const theChecker of theCheckers) {
        const lists = theChecker.querySelectorAll('li');
        for (const list of lists) {
            const targetInput = list.querySelector('input');
            const snsIds = list.querySelector('.snsIds');
            // `SNS_チャットサービス`という文字列を含む name属性値を持った input要素の場合は以下のクリックイベントを設置
            if (targetInput.getAttribute('name').includes('SNS_チャットサービス')) {
                targetInput.addEventListener('change', (e) => {
                    checkCheckedSNSlables_ViewEntryIdForm(e, snsIds);
                });
            }
        }
    }
});
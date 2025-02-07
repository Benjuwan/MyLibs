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
            snsIds.querySelector('input').setAttribute('required', 'true');
            snsIds.classList.add('snsIdsView');
        } else {
            snsIds.setAttribute('hidden', 'true');
            snsIds.querySelector('input').removeAttribute('name');
            snsIds.querySelector('input').removeAttribute('required');
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
                // 送信確認から戻ってきた場合に既存のチェック内容を保持するため遅延処理で処置
                if (targetInput.hasAttribute('checked')) {
                    setTimeout(() => checkCheckedSNSlables_ViewEntryIdForm(targetInput, snsIds));
                }
                targetInput.addEventListener('change', (e) => {
                    checkCheckedSNSlables_ViewEntryIdForm(e, snsIds);
                });
            }
        }
    }

    // 特定チェックボックス（ targetCheckbox_labelName ）のチェック検証機能
    const targetCheckbox_labelName = ['SNS_チャットサービス', 'お問い合わせの種類'];
    const isCheckTargetCheckboxes = () => {
        const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

        // targetCheckbox_labelName 内の各種 name属性値を持った input要素を抽出
        const targetItems = [];
        for (const checkBox of checkBoxes) {
            for (const targetName of targetCheckbox_labelName) {
                if (checkBox.getAttribute('name').includes(targetName)) {
                    const targetItem = {
                        itemName: checkBox.getAttribute('name'),
                        itemChecked: checkBox.checked
                    }
                    targetItems.push(targetItem);
                }
            }
        }

        // targetCheckbox_labelName 内の文字列に合致するチェック済み要素を抽出
        const checkedTargetItems = targetItems.filter(targetItem => {
            if (
                // targetCheckbox_labelName は配列なので includesメソッドの実行において完全一致の形式を取るため targetItem.itemNameを調整
                (targetCheckbox_labelName.includes(`${targetItem.itemName.split('[]')[0]}`)) &&
                (targetItem.itemChecked === true)
            ) {
                return targetItem;
            }
        });

        if (checkedTargetItems.length > 0) {
            // targetCheckbox_labelName の各文字列と完全一致させるために checkedTargetItem.itemNameを調整（[]を除去）
            const checkedTargetItemsName = checkedTargetItems.map(checkedTargetItem => checkedTargetItem.itemName.replace('[]', ''));

            // 先に調整済みの配列（ checkedTargetItemsName ）から項目名を重複排除して labelNameに含まれていない＝チェックされていない labelNameを取得（差集合）
            const diff = targetCheckbox_labelName.filter(labelName => !Array.from(new Set(checkedTargetItemsName)).includes(labelName));

            // 非チェックのlabelName（項目名）の配列を返す 
            return diff;
        }

        return undefined;
    }

    // 送信アクション
    const submitBtn = document.querySelector('button[type="submit"]');
    const theForm = document.querySelector('form');
    // 送信確認画面でのみ送信イベントを実行
    if (location.pathname.split('/').at(-1).startsWith('mail') !== true) {
        submitBtn.addEventListener('click', (e) => submit_isTargetCheckBoxesAllChecked(e));
        theForm.addEventListener('submit', (e) => submit_isTargetCheckBoxesAllChecked(e));
    }

    /**
     * targetCheckbox_labelName の各項目で一つでもチェックされているかどうか確認
     * @param { HashChangeEvent<HTMLFormElement | HTMLButtonElement>} e 
     * @returns void
     */
    const submit_isTargetCheckBoxesAllChecked = (e) => {
        const noCheckedLabels = isCheckTargetCheckboxes();
        if (typeof noCheckedLabels === 'undefined') {
            alert(`対象項目「${[...targetCheckbox_labelName].join(' | ')}」\nそれぞれで最低一つはチェックしてください`);
            e.preventDefault();
            return;
        } else if (noCheckedLabels.length > 0) {
            alert(`対象項目「${[...noCheckedLabels]}」\n最低一つはチェックしてください`);
            e.preventDefault();
            return;
        }
    }
});

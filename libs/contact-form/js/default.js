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
                (targetCheckbox_labelName.includes(`${targetItem.itemName.split('[]')[0]}`)) &&
                (targetItem.itemChecked === true)
            ) {
                return targetItem;
            }
        });

        if (checkedTargetItems.length > 0) {
            // 非チェックの対象項目名を抽出
            const noCheckedLabel = [];
            targetCheckbox_labelName.forEach(targetName => {
                for (const checkedItemName of checkedTargetItems) {
                    if (!checkedItemName.itemName.includes(targetName)) {
                        noCheckedLabel.push(targetName);
                    }
                }
            });

            // 重複排除した非チェックの input要素名（の配列）を返す
            return Array.from(new Set(noCheckedLabel));
        }

        return undefined;
    }

    // 送信アクション
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.addEventListener('click', (e) => submit_isTargetCheckBoxesAllChecked(e));

    const theForm = document.querySelector('form');
    theForm.addEventListener('submit', (e) => submit_isTargetCheckBoxesAllChecked(e));

    /**
     * targetCheckbox_labelName の各項目で一つでもチェックされているかどうか確認
     * @param { HashChangeEvent<HTMLFormElement | HTMLButtonElement>} e 
     * @returns void
     */
    const submit_isTargetCheckBoxesAllChecked = (e) => {
        const noCheckedLabel = isCheckTargetCheckboxes();
        if (typeof noCheckedLabel === 'undefined') {
            alert(`対象項目「${[...targetCheckbox_labelName].join(' | ')}」\nそれぞれで最低一つはチェックしてください`);
            e.preventDefault();
            return;
        } else {
            if (noCheckedLabel.length < targetCheckbox_labelName.length) {
                alert(`対象項目「${[...noCheckedLabel]}」\n最低一つはチェックしてください`);
                e.preventDefault();
                return;
            }
        }
    }
});

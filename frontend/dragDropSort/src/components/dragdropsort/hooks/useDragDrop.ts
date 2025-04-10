import ddsStyle from "../styles/style.module.css";
import { DragEvent, useState } from "react";

export const useDragDrop = (dropzoneRef: React.RefObject<HTMLUListElement>) => {
    // ユーザー定義型ガード：touches プロパティがある場合、型は React.TouchEvent となる
    const isTouchEvent = (event: React.SyntheticEvent): event is React.TouchEvent => 'touches' in event; // in演算子：指定されたプロパティが指定されたオブジェクトにある場合に true を返す

    // スタイルの初期化処理（DOM操作でclass属性排除）
    const _initListsStyle: () => void = () => {
        const theList: NodeListOf<HTMLLIElement> | undefined = dropzoneRef.current?.querySelectorAll('li');
        theList?.forEach(list => list.removeAttribute('class'));
    }

    // ドラッグ操作全体を通じて現在ドラッグされている要素を追跡するためのグローバル変数
    const [draggedElm, setDraggedElm] = useState<EventTarget | HTMLElement | null>(null);

    // ソート機能：dragover と drop イベントにおける共通関数
    const _commonAction_Dragover_Drop = (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (!isTouchEvent(e)) {
            e.preventDefault(); // デフォルトのドラッグ動作を防止（これがないとdropが発火しない）
        } else {
            document.querySelector('html')?.style.setProperty('overflow', 'hidden');
        }

        const targetElm: EventTarget | HTMLElement = e.target;

        // draggedElm と targetElm が HTML要素かどうかをチェック
        if (
            draggedElm instanceof HTMLElement &&
            targetElm instanceof HTMLElement
        ) {
            // dropイベント対象（li）以外の範囲にマウスカーソルが侵入した場合は処理終了（insertBeforeに関するエラー回避）
            // ※注意としてイベント要素（targetElm）は「子要素を含んだアクティブになっている要素が認定」される。つまり、li の子要素の button を選択すれば tagName は BUTTON になる。
            if (targetElm.tagName !== 'LI') return;

            const rect = draggedElm.getBoundingClientRect(); // draggedElm（DOM要素）を長方形にした想定でビューポート内の位置（width, height, top, left, bottom, right, x, y, etc...）・座標を把握する

            /* middle：要素の垂直方向の中心点（childMiddle）を計算（=要素のviewportHeight（y）からの数値（top）と、要素自体の高さを半分にした数値の合算。この中心点を基準にすることで要素の上半分にドラッグした場合は「その要素の前に」配置、下半分にドラッグした場合は「その要素の後に」配置するという処理を実現） */
            const middle = rect.top + rect.height / 2; // 要素の垂直方向の中心点
            const posY = !isTouchEvent(e) ? e.clientY : e.changedTouches[0].clientY; // e（マウスカーソル／ポインター）要素のビューポートにおけるY軸の数値（座標）

            if (posY < middle) {
                draggedElm.classList.add(ddsStyle.draggingUpper);
                // マウスポインターの位置（posY）が要素の中心線（middle）より「上（半分）」にある場合、ドラッグ要素はターゲット要素（targetElm）の前に配置
                if (!isTouchEvent(e)) {
                    dropzoneRef.current?.insertBefore(draggedElm, targetElm); // insertBefore(newNode, referenceNode)：referenceNode の前に newNode を挿入
                } else {
                    // タッチ系イベント（スマホ／タブレット）
                    if (targetElm.previousSibling !== null) {
                        // draggedElm を targetElm の2つ前の位置に配置
                        dropzoneRef.current?.insertBefore(draggedElm, targetElm.previousSibling);
                    }
                }
            } else {
                draggedElm.classList.add(ddsStyle.draggingLower);
                // マウスポインターの位置（posY）が要素の中心線（middle）より「下（半分）」にある場合、ターゲット要素（targetElm）の後ろ（nextSibling）に配置する。nextSibling：DOMツリーにおける次の兄弟要素を参照する
                if (!isTouchEvent(e)) {
                    dropzoneRef.current?.insertBefore(draggedElm, targetElm.nextSibling);
                } else {
                    // タッチ系イベント（スマホ／タブレット）
                    if (draggedElm.nextSibling !== null) {
                        // draggedElm の次の要素を targetElm の直前に配置
                        dropzoneRef.current?.insertBefore(draggedElm.nextSibling, targetElm);
                    }
                }
            }
        }
    }

    // dragstart: ドラッグ操作の開始時に1回だけ発火
    const dragstart: (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void = (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        setDraggedElm(e.target);
        if (draggedElm instanceof HTMLElement) {
            draggedElm.classList.add(ddsStyle.dragging);
        }
        dropzoneRef.current?.classList.add(ddsStyle.onDrag);
    }

    // dragend: ドラッグ操作が完了（成功/キャンセル問わず）した時に発火
    const dragend: () => void = () => {
        setDraggedElm(null); // グローバル変数をリセット
        if (draggedElm instanceof HTMLElement) {
            draggedElm.classList.remove('dragging');
        }
        if (dropzoneRef.current?.classList.contains(ddsStyle.onDrag)) {
            dropzoneRef.current?.classList.remove(ddsStyle.onDrag);
        }
        _initListsStyle(); // スタイルの初期化処理（DOM操作でclass属性排除）
    }

    // dragover: ドラッグ中、要素の上にカーソルがある間、継続的に発火
    const dragover: (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void = (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => _commonAction_Dragover_Drop(e);

    // drop: ドラッグ要素を離した時に1回だけ発火
    const drop: (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void = (e: DragEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => _commonAction_Dragover_Drop(e);

    return { dragstart, dragend, dragover, drop }
}
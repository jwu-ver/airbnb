import React, { useCallback, useRef, useState, useMemo } from "react";

import NEXT_BUTTON from "@assets/nextButton.svg";
import PREV_BUTTON from "@assets/prevButton.svg";
import Icon from "@components/common/Icon";
import CalendarPage from "@components/SearchBar/Period/Calendar/CalendarPage";
import { CALENDAR_PAGE, HALF_MOVE_POINT } from "@constants/calendar";
import { useCalendarState } from "@contexts/CalendarProvider";
import { useToday } from "@hooks/useToday";
import { getDirectionValue, getMonthDifference } from "@utils/calendar";

import { DirectionType } from "_types/calendar";

import * as S from "./style";

const initSlideInfo: { moveX: number; direction: DirectionType } = {
  moveX: -HALF_MOVE_POINT,
  direction: null,
};
// TODO 캘린더 슬라이드 라이브러리 만들어보기
// 슬라이더 크기, ...커스텀 스타일, 페이지,

// today 관력 훅으로 빼기
// pageIndex calenderState로 뺴면

// {standardDay, width, height, fontColor, hoverColor, beetweenColor, isSundayColor, fontSize, slideAnimationSpeed & type}
const Calendar = () => {
  const { today, todayYear, todayMonth } = useToday();
  const [slideInfo, setSlideInfo] = useState(initSlideInfo);
  const { checkIn } = useCalendarState();
  const pageIndex = useRef(getMonthDifference(today, checkIn));
  const isMovePending = useRef(false);

  const handleMoveCalendar = useCallback((movePoint: number, direction: DirectionType) => {
    if (!isMovePending.current) {
      isMovePending.current = true;
      setSlideInfo(({ moveX }) => ({ moveX: moveX + movePoint, direction: direction }));
    }
  }, []);

  const handleMoveEnd = useCallback(() => {
    pageIndex.current += getDirectionValue(slideInfo.direction);
    setSlideInfo(() => initSlideInfo);
    isMovePending.current = false;
  }, [slideInfo.direction]);

  const getTodayDatePassByMonth = useCallback(
    (passMonth: number) => new Date(todayYear, todayMonth + passMonth),
    [todayYear, todayMonth],
  );

  const getCalendarPageArr = useCallback(
    (CALENDAR_PAGE: number) =>
      Array.from({ length: CALENDAR_PAGE }, (_, i) => getTodayDatePassByMonth(pageIndex.current + i - 1)),
    [getTodayDatePassByMonth],
  );

  return (
    <S.Calendar>
      <Icon onClick={() => handleMoveCalendar(HALF_MOVE_POINT, "FORWARD")} iconName={PREV_BUTTON} iconSize="small" />
      <S.SlideList movePoint={slideInfo.moveX} direction={slideInfo.direction} onTransitionEnd={handleMoveEnd}>
        {getCalendarPageArr(CALENDAR_PAGE).map((currDate) => (
          <CalendarPage key={currDate.getTime()} currDate={currDate} />
        ))}
      </S.SlideList>
      <Icon onClick={() => handleMoveCalendar(-HALF_MOVE_POINT, "BACKWARD")} iconName={NEXT_BUTTON} iconSize="small" />
    </S.Calendar>
  );
};

export default Calendar;

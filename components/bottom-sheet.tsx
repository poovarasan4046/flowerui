import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ANIMATION_DURATION = 260;
const CLOSE_VELOCITY_THRESHOLD = 1.3;
const DRAG_CLOSE_DISTANCE_RATIO = 0.15; // close sheet once user drags within bottom 15% of screen

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /**
   * Snap points represented as decimal percentages of the screen height (0.0 - 1.0).
   * Example: 0.4 = 40% of the screen height.
   */
  snapPoints?: number[];
  /** Index from snapPoints array to use as the initial height. */
  initialSnapIndex?: number;
  /** Whether tapping the backdrop should close the sheet. */
  enableBackdropDismiss?: boolean;
  /** Backdrop color override (defaults to a soft dim background). */
  backdropColor?: string;
  /** Optional style override for the sheet container. */
  containerStyle?: ViewStyle;
  /** Handle indicator color override. */
  handleIndicatorColor?: string;
};

export function BottomSheet({
  visible,
  onClose,
  children,
  snapPoints = [0.4, 0.85],
  initialSnapIndex = 0,
  enableBackdropDismiss = true,
  backdropColor = "rgba(15, 23, 42, 0.45)",
  containerStyle,
  handleIndicatorColor = "#CBD5F5",
}: BottomSheetProps) {
  const windowHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const [renderSheet, setRenderSheet] = useState(visible);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(() =>
    Math.min(Math.max(initialSnapIndex, 0), snapPoints.length - 1)
  );
  const startOffsetY = useRef(windowHeight);

  const normalizedSnapPoints = useMemo(() => {
    return snapPoints
      .map((point) => Math.min(Math.max(point, 0.1), 1))
      .sort((a, b) => a - b);
  }, [snapPoints]);

  const snapOffsets = useMemo(() => {
    return normalizedSnapPoints.map((point) =>
      Math.max(windowHeight - point * windowHeight, 0)
    );
  }, [normalizedSnapPoints, windowHeight]);

  const minSnapOffset = useMemo(() => {
    return snapOffsets.length ? Math.min(...snapOffsets) : 0;
  }, [snapOffsets]);

  const currentOffset = useMemo(() => {
    return snapOffsets[currentSnapIndex] ?? windowHeight * 0.6;
  }, [currentSnapIndex, snapOffsets, windowHeight]);

  const animateToOffset = useCallback(
    (offset: number, callback?: () => void) => {
      Animated.timing(translateY, {
        toValue: offset,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && callback) {
          callback();
        }
      });
    },
    [translateY]
  );

  const closeSheet = useCallback(() => {
    animateToOffset(windowHeight, () => {
      setRenderSheet(false);
      onClose();
    });
  }, [animateToOffset, onClose, windowHeight]);

  const expandToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(Math.max(index, 0), snapOffsets.length - 1);
      setCurrentSnapIndex(clampedIndex);
      animateToOffset(snapOffsets[clampedIndex]);
    },
    [animateToOffset, snapOffsets]
  );

  useEffect(() => {
    if (visible) {
      setRenderSheet(true);
    } else {
      closeSheet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!renderSheet) return;
    expandToIndex(currentSnapIndex);
  }, [renderSheet, currentSnapIndex, expandToIndex]);

  const handlePressHandle = useCallback(() => {
    if (currentSnapIndex < snapOffsets.length - 1) {
      expandToIndex(snapOffsets.length - 1);
    } else {
      expandToIndex(0);
    }
  }, [currentSnapIndex, expandToIndex, snapOffsets.length]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > Math.abs(gesture.dx) && Math.abs(gesture.dy) > 4,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dy) > Math.abs(gesture.dx) && Math.abs(gesture.dy) > 4,
        onPanResponderGrant: () => {
          translateY.stopAnimation((value: number) => {
            startOffsetY.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          const nextOffset = startOffsetY.current + gesture.dy;
          const clampedOffset = Math.min(
            Math.max(nextOffset, minSnapOffset),
            windowHeight
          );
          translateY.setValue(clampedOffset);
        },
        onPanResponderRelease: (_, gesture) => {
          const finalOffset = startOffsetY.current + gesture.dy;
          const isSwipeDown = gesture.vy > CLOSE_VELOCITY_THRESHOLD;
          const bottomThreshold = windowHeight - windowHeight * DRAG_CLOSE_DISTANCE_RATIO;
          const shouldCloseByDistance = finalOffset >= bottomThreshold;

          if (isSwipeDown || shouldCloseByDistance) {
            closeSheet();
            return;
          }

          const candidateOffsets = [...snapOffsets, windowHeight];
          const nearestOffset = candidateOffsets.reduce((closest, offset) => {
            return Math.abs(offset - finalOffset) < Math.abs(closest - finalOffset)
              ? offset
              : closest;
          }, candidateOffsets[0] ?? windowHeight);

          if (nearestOffset === windowHeight) {
            closeSheet();
            return;
          }

          const nearestIndex = snapOffsets.indexOf(nearestOffset);
          setCurrentSnapIndex(nearestIndex);
          animateToOffset(nearestOffset);
        },
      }),
    [
      animateToOffset,
      closeSheet,
      minSnapOffset,
      snapOffsets,
      translateY,
      windowHeight,
    ]
  );

  const backdropOpacity = translateY.interpolate({
    inputRange: [minSnapOffset, windowHeight],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (!renderSheet) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={renderSheet}
      animationType="none"
      onRequestClose={closeSheet}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={enableBackdropDismiss ? closeSheet : undefined}
        >
          <Animated.View
            style={[styles.backdrop, { backgroundColor: backdropColor, opacity: backdropOpacity }]}
          />
        </Pressable>

        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.sheetContainer, { transform: [{ translateY }], height: windowHeight, zIndex: 9999 }, containerStyle]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.dragRegion}>
              <Pressable onPress={handlePressHandle} accessible accessibilityRole="button">
                <View style={styles.handleWrapper}>
                  <View
                    style={[styles.handleIndicator, { backgroundColor: handleIndicatorColor }]}
                  />
                </View>
              </Pressable>
            </View>
            <View style={styles.content}>{children}</View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  safeArea: {
    flex: 1,
  },
  dragRegion: {
    paddingTop: 4,
  },
  handleWrapper: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handleIndicator: {
    width: 48,
    height: 5,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 2,
  },
});

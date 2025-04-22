import {StyleSheet} from "react-native";
import {COLORS} from "./colors";

export const SIDEPANEL = StyleSheet.create({
    container: {
        width: 260,
        backgroundColor: COLORS.white,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
        paddingTop: 12,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray,
        marginHorizontal: 16,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
        color: COLORS.text,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
        color: COLORS.text,
    },
    list: {
        flex: 1,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    itemSelected: {
        backgroundColor: COLORS.lightBlue,
    },
    avatarWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor:  COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        color: COLORS.text,
    },
    separator: {
        height: 1,
        backgroundColor:  COLORS.border,
        marginHorizontal: 16,
    },

});

package uk.dynamenusystem.dynamenusystem

import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class UnitTests {
    @Test
    fun useAppContext() {
        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        assertEquals("uk.dynamenusystem.dynamenusystem", appContext.packageName)
    }

    @Test
    fun markdownConversionTestBold() {
        val answer = Markdown.convertMarkdownToHTML("**Bold text**", "", "")
        assertEquals("<strong>Bold text</strong>", answer)
    }

    @Test
    fun markdownConversionTestItal() {
        val answer = Markdown.convertMarkdownToHTML("*Italic text*", "", "")
        assertEquals("<em>Italic text</em>", answer)
    }

    @Test
    fun markdownConversionTestStrikeThrough() {
        val answer = Markdown.convertMarkdownToHTML("~~Strikeout text~~", "", "")
        assertEquals("<strike>Strikeout text</strike>", answer)
    }

    @Test
    fun markdownConversionTestUnderlined() {
        val answer = Markdown.convertMarkdownToHTML("__Underlined text__", "", "")
        assertEquals("<u>Underlined text</u>", answer)
    }

    @Test
    fun markdownConversionTestHeading() {
        val answer = Markdown.convertMarkdownToHTML("# Heading 1", "", "")
        assertEquals("<h1>Heading 1</h1>", answer)
    }

    @Test
    fun markdownConversionTestColor() {
        val answer = Markdown.convertMarkdownToHTML("{#0000FF,TextGoesHere}", "", "")
        assertEquals("<span style=\"color: #0000FF;\">TextGoesHere</span>", answer)
    }

    @Test
    fun markdownConversionTestLink() {
        val answer = Markdown.convertMarkdownToHTML("[ExampleText](http://www.example.com/)", "", "")
        assertEquals("<a href=\"http://www.example.com/\">ExampleText</a>", answer)
    }

    @Test
    fun markdownConversionTestOrderedList() {
        val answer = Markdown.convertMarkdownToHTML("1. ListItem", "", "")
        assertEquals("1. ListItem", answer)
    }

    @Test
    fun markdownConversionTestUnorderedList() {
        val answer = Markdown.convertMarkdownToHTML("* ListItem", "", "")
        assertEquals(" • ListItem", answer)
    }
}
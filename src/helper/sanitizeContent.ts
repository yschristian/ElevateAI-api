import sanitizeHtml from 'sanitize-html';

export const sanitizeContent = (content: string): string => {
    const sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'b',        // Bold
            'i',        // Italic
            'blockquote', // Quote
            'ol',       // Ordered list
            'ul',       // Unordered list
            'li',       // List item
            'span',     // Span for inline styles
            'strong',   // Strong text (bold)
            'em',       // Emphasized text (italic)
            'del',      // Strikethrough
            'ins',      // Underline
            'task-list' // Custom tag for task lists (if needed)
        ]),
        allowedAttributes: {
            '*': ['style', 'class'], // Allow these attributes on all tags
            'blockquote': ['cite'],   // Allow cite attribute on blockquote
            'img': ['src', 'alt'],    // Allow src and alt attributes on images
            'a': ['href', 'title'],    // Allow href and title attributes on links
        },
    });

    return sanitizedContent;
};